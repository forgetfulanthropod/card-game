import type { Datum } from 'datums'
import { datum } from 'datums'
import type { Listener, ROCursor } from 'sbaobab'
import type {
    CardHit,
    CharacterMeta,
    CharacterUid,
    NetworkDOTData,
    NetworkEvent,
    StatChangeMap,
    StatChangesMap,
} from 'shared'
import { keys } from 'shared/code'
import { MainCharacterAnimation } from '@sharedElements'
import type { TrackEntry } from '@pixi-spine/all-4.0'
import { diff } from 'deep-diff'
import { HealthBar } from './HealthBar'
import { HitInfo } from './HitInfo'
import { NpcIntentArrow } from './NpcIntentArrow'
import { FloatingIntents } from './FloatingIntents'

import { StatusEffectOverlayManager } from './StatusEffectOverlayManager'
import { getOrbTexture, getCharTexture } from '@/assets'
import { hoveredCharacterUid, onUpdate, toDatum } from '@/util'
import {
    Adjust,
    Container,
    flashTo,
    If,
    SCALE_UNIVERSAL,
    Sprite,
    Text,
    AttackOverlayAnimation,
} from '@/elementsUtil'
import type { PixiContainer, PixiSpine } from '@/elementsUtil'

import { callApi } from '@/callApi'
import { socketOn } from '@/socket'
import { getBattleScene } from '@/data'

const SHOW_HIT_TIME = 1000

type CharacterCursor = ROCursor<CharacterMeta>
interface CharacterProps {
    onClick: (c: CharacterUid) => void
    scale: number
    cursor: ROCursor<CharacterMeta>
    statChangesDatum: Datum<StatChangesMap>
}

export function Character(props: CharacterProps): PixiContainer {
    const isHovered = datum(false)
    const characterMeta = props.cursor.get()
    const { screenX, screenY } = characterMeta

    const mainAnimation = MainCharacterAnimation({
        characterMeta,
        events: {
            pointerup: () => props.onClick(characterMeta.uid),
            pointerdown: () => {
                hoveredCharacterUid.set(characterMeta.uid)
                props.onClick(characterMeta.uid)
            },
        },
        centerX: true,
    })

    const mainContainer = Container(
        {
            isHoveredDatum: isHovered,
        },
        Adjust(NpcIntentArrow(characterMeta.uid, isHovered), {
            y: 22,
        }),
        ...(mainAnimation ? [Adjust(mainAnimation, { y: -20 })] : []),
        mainAnimation == null &&
            FallBackCharacterSprite(characterMeta, props.onClick),
        If(
            toDatum(getBattleScene().select('isPlayerTurn'), is => is),
            () =>
                Adjust(FloatingIntents(characterMeta.uid), {
                    y: -220,
                    x: -30,
                })
        ),
        Adjust(HealthBar(characterMeta.uid), { y: 11 })
    )

    const hitContainer = Container({
        x: 0,
        y: -220,
    })

    return Container(
        {
            name: 'Character Wrap',
            x: screenX,
            y: screenY,
            // scale: (characterMeta.y / 100) * 0.3 + 0.9, //depth calc
            onDestroy: [
                bindMoves(
                    characterMeta,
                    hitContainer,
                    mainAnimation,
                    props.statChangesDatum
                ),
                bindDOT(characterMeta, hitContainer),
                bindStatChanges(props.cursor, props.statChangesDatum),
            ],
        },

        mainContainer,
        OrbManager(props.cursor, mainContainer.height * 0.92),
        StatusEffectOverlayManager(
            props.statChangesDatum,
            characterMeta,
            -mainContainer.height * 0.5
        ),
        hitContainer
    )
}

function FallBackCharacterSprite(
    characterMeta: CharacterMeta,
    onClick: (_: CharacterUid) => void
) {
    const charSrc = getCharTexture(characterMeta.id)
    return Sprite({
        src: charSrc,
        anchor: [0, 1],
        y: -20,
        events: { pointerup: () => onClick(characterMeta.uid) },
        x: ((characterMeta.isPc ? 1 : -2) * charSrc.width) / 4,
    })
}

function OrbManager(
    characterCursor: CharacterCursor,
    offset: number
): PixiContainer {
    const orbContainer = Container({
        x: 0,
        y: -offset,
        name: 'OrbContainer',
    })
    const orbWidth = 45

    const orbsCursor = characterCursor.select('orbs')
    const unsub = onUpdate(
        orbsCursor,
        orbs => {
            if (orbs == null) {
                unsub?.()
                return
            }
            orbContainer.removeChildren()
            orbs.forEach((orb, i) => {
                orbContainer.addChild(
                    Container(
                        {
                            x: i * orbWidth * 1.5,
                            onClick: async () => {
                                await callApi('activateOrb', {
                                    characterUid: characterCursor.get('uid'),
                                    orb,
                                })
                            },
                        },
                        Sprite({
                            src: getOrbTexture(orb.type),
                            width: orbWidth * SCALE_UNIVERSAL,
                            height: orbWidth * SCALE_UNIVERSAL,
                        }),
                        Text({
                            text: `${orb.remainingCount}`,
                            style: {
                                fontFamily: 'bigFont',
                                fontSize: 14 * SCALE_UNIVERSAL,
                                fill: ['#fff', '#eee'], // gradient
                                // letterSpacing: -5,
                                stroke: '#333',
                                strokeThickness: 5,
                            },
                        })
                    )
                )
            })
        },
        true
    )

    return orbContainer
}

function bindDOT(
    characterMeta: CharacterMeta,
    aboveCharacterContainer: PixiContainer
): Unbind {
    return socketOn('DOT$', handleDOT)
    function handleDOT(event: NetworkEvent<'damage$', NetworkDOTData>) {
        const { damageMap } = event.data

        keys(damageMap).forEach(characterUid => {
            if (characterUid === characterMeta.uid)
                flashPoisonTo(aboveCharacterContainer, damageMap[characterUid])
        })
    }
}

function bindMoves(
    characterMeta: CharacterMeta,
    aboveCharacterContainer: PixiContainer,
    mainAnimation: PixiSpine | null,
    statChangesDatum: Datum<StatChangesMap>
): Unbind {
    const unbindStatChangesListener = statChangesDatum.onChange(changes => {
        keys(changes).forEach(uid => {
            if (uid === characterMeta.uid && changes[uid].health) {
                if (mainAnimation) {
                    mainAnimation.state.setAnimation(0, 'Damage', false)

                    const takingDamageListener = {
                        event: function reactToDamage(
                            _entry: TrackEntry,
                            event: { data: { name: string } }
                        ) {
                            if (event.data.name !== 'Taking Damage') return

                            const effectAnimation = AttackOverlayAnimation(
                                characterMeta.isPc
                            )
                            if (effectAnimation)
                                mainAnimation.parent.addChild(effectAnimation)

                            mainAnimation.state.removeListener(
                                takingDamageListener
                            )
                        },
                    }
                    mainAnimation.state.addListener(takingDamageListener)

                    mainAnimation.state.addAnimation(0, 'Idle', true)
                }
                if (changes[uid].health)
                    flashDamageTo(
                        aboveCharacterContainer,
                        changes[uid].health ?? 0
                    )
            }
        })
    })
    const unbindDamage$Listener = socketOn('damage$', showCharMove)

    const attackListener = {
        event: function reactToAttack(
            _entry: TrackEntry,
            event: { data: { name: string } }
        ) {
            if (event.data.name === 'Attack') {
                const statChanges: StatChangesMap = {}

                keys(damages).forEach(uid => {
                    statChanges[uid] = { health: damages[uid] }
                })

                if (keys(statChanges).length) statChangesDatum.set(statChanges)
            }
        },
    }
    let damages: StatChangeMap = {}

    mainAnimation?.state.addListener(attackListener)

    return () => {
        unbindStatChangesListener()
        unbindDamage$Listener()
        mainAnimation?.state.removeListener(attackListener)
    }

    function showCharMove(event: NetworkEvent<'damage$', CardHit>) {
        const { attacker, cardName: _cardName, damages: _damages } = event.data

        const thisUid = characterMeta.uid
        if (attacker === thisUid) {
            if (mainAnimation == null) return

            mainAnimation.state.setAnimation(0, 'Attack', false)
            mainAnimation.state.addAnimation(0, 'Idle', true)
            damages = _damages
        }
    }
}

function bindStatChanges(
    characterCursor: CharacterCursor,
    statChangesDatum: Datum<StatChangesMap>
) {
    const update: Listener<CharacterMeta> = ({
        data: { currentData, previousData },
    }) => {
        const dataChanges = diff(previousData, currentData)
        const statChanges: Partial<CharacterMeta> = {}

        dataChanges?.forEach(c => {
            const key = c.path?.[0]
            if (c.kind === 'E') {
                //@ts-ignore
                statChanges[key] = c.rhs - c.lhs
            } else if (c.kind === 'A') {
                //@ts-ignore
                statChanges[key] = [...(statChanges[key] ?? []), c.item.rhs]
            }
        })
        // console.log({ dataChanges, metaChanges: statChanges })

        if (keys(statChanges).length)
            statChangesDatum.set({ [currentData.uid]: statChanges })
    }

    characterCursor.on('update', update)
    return () => characterCursor.off('update', update)
}

function flashPoisonTo(
    aboveCharacterContainer: PixiContainer,
    damage: number
): void {
    flashTo(
        aboveCharacterContainer,
        () => HitInfo({ damage, isPoison: true }),
        {
            durationMs: SHOW_HIT_TIME,
        }
    )
}

function flashDamageTo(
    aboveCharacterContainer: PixiContainer,
    damage: number
): void {
    flashTo(aboveCharacterContainer, () => HitInfo({ damage }), {
        durationMs: SHOW_HIT_TIME,
    })
}

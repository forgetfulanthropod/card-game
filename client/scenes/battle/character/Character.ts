import type { Datum } from 'datums'
import { datum } from 'datums'
import type { Listener, ROCursor } from 'sbaobab'
import type {
    CardHit,
    CharacterMeta,
    CharacterUid,
    NetworkDOTData,
    NetworkEvent,
    StatChangesMap,
    TargetType,
} from 'shared'
import { keys } from 'shared/code'
import { MainCharacterAnimation } from '@sharedElements'
import type { TrackEntry } from '@pixi-spine/all-4.0'
import { diff } from 'deep-diff'
import { HealthBar } from './HealthBar'
import { HitInfo } from './HitInfo'
import { NpcIntentArrow } from './NpcIntentArrow'
import { FloatingIntents } from './FloatingIntents'

import { EffectOverlayManager } from './EffectOverlayManager'
import { getOrbTexture, getCharTexture } from '@/assets'
import {
    hoveredCharacterUid,
    nextTick,
    onUpdate,
    playDamageAnimation,
    statChangesDatum,
    targetUidsWaitingForImpact,
    toDatum,
} from '@/util'
import {
    Adjust,
    Container,
    flashTo,
    If,
    SCALE_UNIVERSAL,
    Sprite,
    Text,
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
        ...(mainAnimation
            ? [
                  Adjust(mainAnimation, {
                      y: -20,
                      x: characterMeta.isPc ? 40 : mainAnimation.x,
                  }),
              ]
            : []),
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
                bindMoves(characterMeta, hitContainer, mainAnimation),
                bindDOT(characterMeta, hitContainer),
                bindStatChanges(props.cursor),
            ],
        },

        mainContainer,
        OrbManager(props.cursor, mainContainer.height * 0.92),
        EffectOverlayManager(characterMeta, -mainContainer.height * 0.5),
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
    function handleDOT(event: NetworkEvent<'move$', NetworkDOTData>) {
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
    mainAnimation: PixiSpine | null
): Unbind {
    const unbindDamageAnimationListener = playDamageAnimation.onChange(play => {
        if (!play) return

        const changes = statChangesDatum.val

        keys(changes).forEach(uid => {
            if (
                uid === characterMeta.uid &&
                targetUidsWaitingForImpact.val.includes(characterMeta.uid)
            ) {
                if (mainAnimation) {
                    triggerDamageAnimation(mainAnimation)
                }
                if (changes[uid].health)
                    flashDamageTo(
                        aboveCharacterContainer,
                        changes[uid].health ?? 0
                    )
            }
        })
    })
    const unbindmove$Listener = socketOn('move$', showCharMove)
    // let targetUidsWaitingForImpact: CharacterUid[] = []

    const attackSpineEventListener = {
        event: function reactToAttack(
            _entry: TrackEntry,
            event: { data: { name: string } }
        ) {
            if (event.data.name === 'Attack') {
                playDamageAnimation.set(true)
                setTimeout(() => playDamageAnimation.set(false), 0)
            }
        },
    }

    mainAnimation?.state.addListener(attackSpineEventListener)

    return () => {
        unbindDamageAnimationListener()
        unbindmove$Listener()
        mainAnimation?.state.removeListener(attackSpineEventListener)
    }

    function showCharMove(event: NetworkEvent<'move$', CardHit>) {
        const attackingTargetTypes: TargetType[] = ['enemies', 'allEnemies']
        const isAttack = attackingTargetTypes.includes(event.data.targetType)

        if (isAttack && event.data.characterUid === characterMeta.uid) {
            if (mainAnimation == null) return

            targetUidsWaitingForImpact.set([
                ...targetUidsWaitingForImpact.val,
                ...event.data.targetUids,
            ])

            const statChanges = { ...statChangesDatum.val }
            targetUidsWaitingForImpact.val.forEach(
                uid =>
                    (statChanges[uid] = {
                        ...(statChanges[uid] ?? {}),
                        wait: true,
                    })
            )

            statChangesDatum.set(statChanges)

            mainAnimation.state.setAnimation(0, 'Attack', false)
            mainAnimation.state.addAnimation(0, 'Idle', true)
        }
    }
}

function triggerDamageAnimation(mainAnimation: PixiSpine) {
    mainAnimation.state.setAnimation(0, 'Damage', false)

    const takingDamageListener = {
        event: function reactToDamage(
            _entry: TrackEntry,
            event: { data: { name: string } }
        ) {
            if (event.data.name !== 'Taking Damage') return

            unlockWaitingStatChanges(statChangesDatum)

            // const effectAnimation = AttackOverlayAnimation(characterMeta.isPc)
            // if (effectAnimation) mainAnimation.parent.addChild(effectAnimation)

            mainAnimation.state.removeListener(takingDamageListener)
        },
    }
    mainAnimation.state.addListener(takingDamageListener)

    mainAnimation.state.addAnimation(0, 'Idle', true)
}

function unlockWaitingStatChanges(statChangesDatum: Datum<StatChangesMap>) {
    let statChanges = { ...statChangesDatum.val }

    targetUidsWaitingForImpact.val.forEach(
        uid =>
            (statChanges[uid] = {
                ...statChanges[uid],
                wait: false,
            })
    )
    statChangesDatum.set(statChanges)

    // const targetUidsToClear = [...targetUidsWaitingForImpact.val]
    setTimeout(function clearProcessedChanges() {
        if (
            targetUidsWaitingForImpact.val.find(uid => statChanges[uid]?.wait)
        ) {
            setTimeout(clearProcessedChanges, 100)

            return
        }

        statChanges = { ...statChangesDatum.val }
        targetUidsWaitingForImpact.val.forEach(uid => (statChanges[uid] = {}))
        targetUidsWaitingForImpact.set([])
        statChangesDatum.set(statChanges)
    }, 100)
}

function bindStatChanges(characterCursor: CharacterCursor) {
    const update: Listener<CharacterMeta> = async ({
        data: { currentData, previousData },
    }) => {
        await nextTick()

        if (currentData == null) {
            console.log('null character meta')
            return
        }

        const dataChanges = diff(previousData, currentData)
        const statChanges: Partial<CharacterMeta & { wait: boolean }> =
            { wait: statChangesDatum.val[currentData.uid].wait } ?? {}

        dataChanges?.forEach(c => {
            const key = c.path?.[0]

            if (c.path?.[0] === 'effects') {
                statChanges.effects = currentData.effects
            } else if (c.kind === 'E') {
                //@ts-ignore
                statChanges[key] = c.rhs - c.lhs
            } else if (c.kind === 'A') {
                //@ts-ignore
                statChanges[key] = [...(statChanges[key] ?? []), c.item.rhs]
            }
        })
        // console.log({ dataChanges, metaChanges: statChanges })
        // console.log({
        //     statChanges,
        //     statChangesGlobal: statChangesDatum.val,
        //     didStatsChange:
        //         JSON.stringify(statChangesDatum.val) ===
        //         JSON.stringify({
        //             ...statChangesDatum.val,
        //             [currentData.uid]: statChanges,
        //         }),
        // })

        //@ts-ignore
        if (keys(statChanges).length)
            statChangesDatum.set({
                ...statChangesDatum.val,
                [currentData.uid]: statChanges,
            })
        // if (statChanges.wait !== true)
        //     setTimeout(
        //         () =>
        //             statChangesDatum.set({
        //                 ...statChangesDatum.val,
        //                 [currentData.uid]: {},
        //             }),
        //         0
        //     )
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

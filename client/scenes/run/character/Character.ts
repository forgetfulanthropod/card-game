import type { Datum } from 'datums'
import { datum } from 'datums'
// import { sound } from '@pixi/sound'
import type { TrackEntry } from '@pixi-spine/all-4.1'
import {
    flashDamageOverlayTo,
    MainCharacterAnimation,
    shakeScreen,
} from '@sharedElements'
import { diff } from 'deep-diff'
import type { Listener, ROCursor } from 'sbaobab'
import type {
    CardHit,
    CharacterId,
    CharacterMeta,
    CharacterUid,
    NetworkDOTData,
    NetworkEvent,
    StatChangesMap,
    TargetType,
} from 'shared'
import { keys } from 'shared/code'
import { FloatingIntents } from './FloatingIntents'
import { HealthBar, HEALTH_BAR_WIDTH } from './HealthBar'
import { HitInfo } from './HitInfo'
import { NpcIntentArrow } from './NpcIntentArrow'

import { getCharTexture, SoundEffectAssetKey } from '@/assets'
import { getStage, PixiContainer, PixiSpine } from '@/elementsUtil'
import {
    Adjust,
    Container,
    flashTo,
    If,
    playSound,
    Sprite,
} from '@/elementsUtil'
import {
    hoveredCharacterUid,
    nextTick,
    playDamageAnimation,
    statChangesDatum,
    targetUidsWaitingForImpact,
    toDatum,
} from '@/util'
import { EffectOverlayManager } from './EffectOverlayManager'

import { getBattleScene } from '@/data'
import { socketOn } from '@/socket'
import { upperFirst } from 'lodash'
import { Assets } from 'pixi.js'
import { OrbManager } from './OrbManager'

const SHOW_HIT_TIME = 1000

export type CharacterCursor = ROCursor<CharacterMeta>
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
        _centerX: true,
    })

    const mainContainer = Container(
        {
            isHoveredDatum: isHovered,
        },
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
        Adjust(HealthBar(characterMeta.uid), { y: 11 }),
        If(
            toDatum(getBattleScene().select('isPlayerTurn'), is => is),
            () =>
                Adjust(FloatingIntents(characterMeta.uid), {
                    y: 0,
                    x: characterMeta.isPc ? HEALTH_BAR_WIDTH : 0,
                })
        )
    )

    setTimeout(
        () => {
            if (getStage().getChildByName('NpcIntentArrowContainer', true))
                mainContainer.addChild(
                    Adjust(NpcIntentArrow(characterMeta.uid, isHovered), {
                        y: 22,
                    })
                )
        },
        0 //todo: portalize looking for nonexistent container, nextTick and nextFrame broke
    )

    const hitContainer = Container({
        x: characterMeta.isPc ? 30 : 50,
        y: -50,
    })

    const orbOffset =
        characterMeta.id === 'jerry' ? 150 : mainContainer.height * 0.92

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
        OrbManager(props.cursor, orbOffset),
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
                if (!mainAnimation) return

                triggerDamageAnimation(mainAnimation, characterMeta)
                if (changes[uid].health) {
                    shakeScreen(1, characterMeta.isPc)
                    flashDamageOverlayTo(mainAnimation)
                    flashDamageNumberTo(
                        aboveCharacterContainer,
                        changes[uid].health ?? 0
                    )
                }
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
            playAttackSound(characterMeta)
            mainAnimation.state.addAnimation(0, 'Idle', true)
        }
    }
}

function triggerDamageAnimation(
    mainAnimation: PixiSpine,
    characterMeta: CharacterMeta
) {
    mainAnimation.state.setAnimation(0, 'Damage', false)
    playTakingDamageSound(characterMeta)

    const takingDamageListener = {
        event: function reactToDamage(
            _entry: TrackEntry,
            event: { data: { name: string } }
        ) {
            if (event.data.name !== 'Taking Damage') return

            unlockWaitingStatChanges(statChangesDatum, characterMeta)

            // const effectAnimation = AttackOverlayAnimation(characterMeta.isPc)
            // if (effectAnimation) mainAnimation.parent.addChild(effectAnimation)

            mainAnimation.state.removeListener(takingDamageListener)
        },
    }
    mainAnimation.state.addListener(takingDamageListener)

    mainAnimation.state.addAnimation(0, 'Idle', true)
}

function unlockWaitingStatChanges(
    statChangesDatum: Datum<StatChangesMap>,
    characterMeta: CharacterMeta
) {
    let statChanges = { ...statChangesDatum.val }

    const characterUid = characterMeta.uid

    statChanges[characterUid] = {
        ...statChanges[characterUid],
        wait: false,
    }

    statChangesDatum.set(statChanges)
    // targetUidsWaitingForImpact.val.forEach(
    //     uid =>
    //         ()
    // )

    // const targetUidsToClear = [...targetUidsWaitingForImpact.val]
    setTimeout(function clearProcessedChanges() {
        // if (
        //     targetUidsWaitingForImpact.val.find(uid => statChanges[uid]?.wait)
        // ) {
        //     setTimeout(clearProcessedChanges, 100)

        //     return
        // }

        statChanges = { ...statChangesDatum.val }
        statChanges[characterUid] = {}
        // targetUidsWaitingForImpact.val.forEach(uid => ())
        const waitingUids = targetUidsWaitingForImpact.val
        const targetUidIndex = waitingUids.indexOf(characterUid)
        targetUidsWaitingForImpact.set([
            ...waitingUids.slice(0, targetUidIndex),
            ...waitingUids.slice(targetUidIndex + 1),
        ])
        statChangesDatum.set(statChanges)
    }, 300)
}

function bindStatChanges(characterCursor: CharacterCursor) {
    const update: Listener<CharacterMeta> = async ({
        data: { currentData, previousData },
    }) => {
        await nextTick()

        if (currentData == null) {
            // console.log('null character meta')
            return
        }

        const dataChanges = diff(previousData, currentData)
        const statChanges: Partial<CharacterMeta & { wait: boolean }> =
            { wait: statChangesDatum.val[currentData.uid]?.wait } ?? {}

        dataChanges?.forEach(c => {
            const key = c.path?.[0]

            if (c.path?.[0] === 'effects') {
                statChanges.effects = previousData.effects.filter(
                    prevEffect =>
                        prevEffect.counter >
                        (currentData.effects.find(e => e.id === prevEffect.id)
                            ?.counter ?? 0)
                )
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

function flashDamageNumberTo(
    aboveCharacterContainer: PixiContainer,
    damage: number
): void {
    flashTo(aboveCharacterContainer, () => HitInfo({ damage }), {
        durationMs: SHOW_HIT_TIME,
    })
}

function playAttackSound(characterMeta: CharacterMeta) {
    playSoundEffect(characterMeta.id, 'Attack')
}

function playTakingDamageSound(characterMeta: CharacterMeta) {
    playSound(`soundGenericTakingDamage`)

    playSoundEffect(characterMeta.id, 'TakingDamage')
}

function playSoundEffect(
    characterId: CharacterId,
    action: 'Attack' | 'TakingDamage'
) {
    const key = `sound${upperFirst(
        characterId
    )}${action}` as SoundEffectAssetKey

    if (Assets.get(key)) playSound(key)
    else if (
        // support for two sounds randomly chosen
        Assets.cache.has(`${key}1`) &&
        Assets.cache.has(`${key}2`)
    )
        playSound(
            `${key}${Math.ceil(Math.random() * 2)}` as SoundEffectAssetKey
        )
}

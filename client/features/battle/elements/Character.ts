import type {
    CharacterMeta,
    CharacterName,
    CharacterUid,
    NetworkAttackData,
    NetworkDOTData,
    NetworkEvent,
} from '@shared'
import type { ROCursor } from 'sbaobab'
import { filters, Loader } from 'pixi.js'

import { activateOrb } from '@/actions'
import { getSocket } from '@/connection'
import { getBattleScene } from '@/data/rootTree'
import type { PixiContainer, PixiSprite } from '@/elementsUtil'
import { SCALE_UNIVERSAL } from '@/elementsUtil'
import { bringToTop } from '@/elementsUtil'
import {
    Container,
    flashElement,
    flashTo,
    hideElement,
    PixiTicker,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiSpine } from '@/elementsUtil/myspine'
import { Spine } from '@/elementsUtil/myspine'
import { keys } from '@/util'

import { getCharTexture, getOrbTexture } from '../logic/assetGetters'
import type { SpineAsset } from '../logic/spineAssets'
import HealthBar from './HealthBar'
import HitInfo from './HitInfo'
// import LevelUp from './LevelUp'
import MoveInfo from './MoveInfo'

const RED = 0xff0000
const BLUE = 0x0000ff
const WHITE = 0xffffff
const SHOW_HIT_TIME = 1000
// const SHOW_LEVEL_UP_TIME = 2000
const ATTACK_ANIMATION_TIME = 1000

type CharacterCursor = ROCursor<CharacterMeta>
interface CharacterProps {
    onClick: (c: CharacterUid) => void
    scale: number
    cursor: ROCursor<CharacterMeta>
    zIndex: number
    isSelected?: boolean
}

export function Character(args: CharacterProps): PixiContainer {
    // NOTE: necessary so the onClick sends the correct data after a character change.
    const characterMeta = { ...args.cursor.get() }
    args.cursor.on('update', () => {
        Object.assign(characterMeta, args.cursor.get())
    })
    const { screenX, screenY } = characterMeta

    // ---Sprites and containers---

    const healthBar = HealthBar(characterMeta.uid)

    const sprites = makeSprites(args, characterMeta, onHeight)
    if (sprites == null) {
        return Container({ children: [] })
    }
    const {
        attackSprite,
        defendSprite,
        mainSprite,
        selectedSprite,
        initialHeight,
    } = sprites

    const mainAnimation = MainCharacterAnimation(characterMeta)

    const mainContainer = Container({
        zIndex: args.zIndex,
        children: [
            attackSprite,
            defendSprite,
            healthBar,
            ...(mainAnimation ? [mainAnimation] : [mainSprite, selectedSprite]),
        ],
    })
    mainContainer.sortChildren()

    const hitContainer = Container({
        x: 0,
        y: -initialHeight,
        children: [],
    })

    const flyingContainer = Container({
        name: 'FlyingContainer',
        x: screenX,
        y: screenY,
        children: [
            mainContainer,
            getBoundOrbContainer(args.cursor, mainContainer.height),
            hitContainer,
        ],
    })

    // ---Functions and listeners---

    function onHeight(height: number) {
        hitContainer.y = -height
    }

    function updateDeathAndHealth() {
        const char = args.cursor.get()
        if (char == null) return

        if (char.health <= 0) {
            flyingContainer.removeChildren()
        }
    }

    args.cursor.select('health').on('update', updateDeathAndHealth)
    args.cursor.select('effects').on('update', updateDeathAndHealth)

    bindDOT(characterMeta, hitContainer)

    bindMoves(
        characterMeta,
        attackSprite,
        healthBar,
        flyingContainer,
        defendSprite,
        hitContainer,
        mainAnimation
    )

    updateDeathAndHealth()

    return flyingContainer
}

export function MainCharacterAnimation(
    characterMeta: Pick<CharacterMeta, 'name' | 'isPc'>
): PixiSpine | null {
    const spineAssetName = getValidSpineAssetName(characterMeta.name)

    if (!spineAssetName) return null

    const mainAnimation = Spine({
        name: spineAssetName,
        animation: 'Idle',
    })

    const desiredHeight = 260 // TODO: what is it tho
    const desiredScale = desiredHeight / mainAnimation.height
    mainAnimation.scale.set(
        (characterMeta.isPc ? 1 : -1) * desiredScale,
        desiredScale
    )

    mainAnimation.x += ((characterMeta.isPc ? 1 : -1) * mainAnimation.width) / 4

    mainAnimation.y -= 20

    return mainAnimation
}

function getBoundOrbContainer(
    characterCursor: CharacterCursor,
    offset: number
): PixiContainer {
    const orbContainer = Container({
        x: 0,
        y: -offset,
        name: 'OrbContainer',
        children: [],
    })
    const orbWidth = 45

    u()
    characterCursor.select('orbs').on('update', u)

    function u() {
        const orbs = characterCursor.get('orbs')

        orbContainer.removeChildren()
        orbs.forEach((orb, i) => {
            orbContainer.addChild(
                Container({
                    x: i * orbWidth * 1.5,
                    onClick: async () => {
                        await activateOrb({
                            characterUid: characterCursor.get('uid'),
                            orb,
                        })
                    },
                    children: [
                        Sprite({
                            src: getOrbTexture(orb.type),
                            width: orbWidth * SCALE_UNIVERSAL,
                            height: orbWidth * SCALE_UNIVERSAL,
                        }),
                        Text({
                            text: `${orb.remainingCount}`,
                            style: {
                                fontFamily: 'VT323',
                                fontSize: 14 * SCALE_UNIVERSAL,
                                fill: ['#fff', '#eee'], // gradient
                                // letterSpacing: -5,
                                stroke: '#333',
                                strokeThickness: 5,
                            },
                        }),
                    ],
                })
            )
        })
    }

    return orbContainer
}

function getValidSpineAssetName(name: CharacterName): SpineAsset | null {
    //@ts-expect-error TODO this goes away when all characters have spines...
    const assetName: SpineAsset = `${name}Spine`

    if (Loader.shared.resources[assetName]) return assetName

    return null
}

function bindDOT(
    characterMeta: CharacterMeta,
    aboveCharacterContainer: PixiContainer
) {
    getSocket().on('DOT$', (event: NetworkEvent<'move$', NetworkDOTData>) => {
        const { damageMap } = event.data

        keys(damageMap).forEach(characterUid => {
            if (characterUid === characterMeta.uid)
                flashPoisonTo(aboveCharacterContainer, damageMap[characterUid])
        })
    })
}

function bindMoves(
    characterMeta: CharacterMeta,
    attackSprite: PixiSprite,
    healthBar: PixiContainer,
    flyingContainer: PixiContainer,
    defendSprite: PixiSprite,
    aboveCharacterContainer: PixiContainer,
    mainAnimation: PixiSpine | null
) {
    const { screenX, screenY } = characterMeta

    getSocket().on(
        'move$',
        function showCharMove(event: NetworkEvent<'move$', NetworkAttackData>) {
            const { attackerUid, defenderUids, moveName, damageKVs } =
                event.data

            const thisUid = characterMeta.uid
            if (attackerUid === thisUid) {
                if (mainAnimation) {
                    mainAnimation.state.setAnimation(0, 'Attack', false)
                    mainAnimation.state.addAnimation(0, 'Idle', true)
                    // mainAnimation.state.
                    // mainAnimation.state.addAnimation(0, 'Idle', true)
                    return
                }

                flashElement(attackSprite, {
                    durationMs: ATTACK_ANIMATION_TIME,
                })
                hideElement(healthBar, { durationMs: ATTACK_ANIMATION_TIME })
                const defender0 = getBattleScene().get(
                    'allCharacters',
                    defenderUids[0]
                )

                bringToTop(flyingContainer)

                const fly = makeFlyToOnTick(
                    { x: screenX, y: screenY },
                    { x: defender0.screenX, y: defender0.screenY }
                )
                PixiTicker.shared.add(function cb(dt) {
                    const result = fly(flyingContainer, dt)
                    if (result === 'remove') PixiTicker.shared.remove(cb)
                })
            }

            if (defenderUids.findIndex(d => d === thisUid) > -1) {
                if (mainAnimation) {
                    mainAnimation.state.setAnimation(0, 'Damage', false)
                    mainAnimation.state.addAnimation(0, 'Idle', true)
                } else {
                    flashElement(defendSprite, {
                        durationMs: ATTACK_ANIMATION_TIME,
                    })
                }

                flashTo(
                    aboveCharacterContainer,
                    () => MoveInfo({ moveName, offset: -70 }),
                    {
                        durationMs: SHOW_HIT_TIME,
                    }
                )
                const damageObj = damageKVs.find(d => d.key === thisUid)
                if (damageObj == null) {
                    console.warn(
                        `damageMap did not provide value for defender with id ${thisUid}. damageMap:`,
                        damageKVs
                    )
                    return
                }

                flashDamageTo(aboveCharacterContainer, damageObj.damage)
            }
        }
    )
}

function makeSprites(
    args: CharacterProps,
    characterMeta: CharacterMeta,
    onHeight: (height: number) => void
) {
    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 20
    const grayFilter = new filters.ColorMatrixFilter()
    grayFilter.saturate(-0.7, false)
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)

    const assetIdCursor = args.cursor.select('name')

    if (assetIdCursor.get() == null) {
        // TODO: has to do with renewChildren()
        // should never occur...
        console.error(
            'null character assetId. probably character was removed or uid was changed.'
        )
        return null
    }

    const charSpriteProps = {
        src: getCharTexture(assetIdCursor.get()),
        anchor: [0, 1] as [number, number],
        height: getCharTexture(assetIdCursor.get()).height,
    }

    const mainSprite = Sprite({
        ...charSpriteProps,
        name: 'mainCharacterSprite',
        onClick: () => {
            args.onClick(characterMeta.uid)
        },
        zIndex: 1,
    })
    const defendSprite = Sprite({
        ...charSpriteProps,
        filters: [blurFilter],
        tint: RED,
        zIndex: 0,
        visible: false,
    })
    const attackSprite = Sprite({
        ...charSpriteProps,
        filters: [blurFilter],
        tint: BLUE,
        zIndex: 0,
        visible: false,
    })
    // props.isSelected && !props.characterMeta.hasMoved
    const selectedId = getBattleScene().select('selectedCharacter')
    const selectedSprite = Sprite({
        ...charSpriteProps,
        filters: [blurFilter],
        tint: WHITE,
        zIndex: 0,
        visible: selectedId.get() === characterMeta.uid,
    })

    assetIdCursor.on('update', () => {
        // tl('asset update')
        const texture = getCharTexture(assetIdCursor.get())
        if (texture == null) {
            // TODO: this occurs when allCharacters gets new characters and this character is no longer defined.
            // (Unique ID: BqUPq)
            // The parent destroys the child but not before this listener fires.
            // Or perhaps tree listeners are not destroyed when a child is destroyed.
            // In that case, the mypixi/Sprite thing needs to take an onDestroy argument that removes the listeners.
            // Anyway, for now we can just return.
            return
        }
        const height = texture.height
        const update = (s: PixiSprite) => {
            s.texture = texture
            s.height = height
        }
        update(selectedSprite)
        update(mainSprite)
        update(defendSprite)
        update(attackSprite)
        onHeight(height)
    })

    selectedId.on('update', () => {
        selectedSprite.visible = selectedId.get() === characterMeta.uid
    })

    return {
        attackSprite,
        defendSprite,
        mainSprite,
        selectedSprite,
        initialHeight: charSpriteProps.height,
    }
}

const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * 0.6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME

function makeFlyToOnTick(start: Point, flyTo: Point, ease = true) {
    let totalElapsed = 0
    let flewTo: { x: number; y: number } | null = null
    const easingFactor = 0.1

    return (container: PixiContainer, elapsed: number): void | 'remove' => {
        // const deltaTimeMs = elapsed * 1000 / 60
        totalElapsed += elapsed * 16.66
        if (totalElapsed < FLY_TO_TIME) {
            if (ease) {
                container.x += (flyTo.x - container.x) * easingFactor
                container.y += (flyTo.y - container.y) * easingFactor
            } else {
                container.x =
                    start.x + ((flyTo.x - start.x) * totalElapsed) / FLY_TO_TIME
                container.y =
                    start.y + ((flyTo.y - start.y) * totalElapsed) / FLY_TO_TIME
            }
        } else if (totalElapsed < FLY_TIME) {
            if (flewTo == null) flewTo = { x: container.x, y: container.y }

            container.x =
                flewTo.x +
                ((start.x - flewTo.x) * (totalElapsed - FLY_TO_TIME)) /
                    FLY_BACK_TIME
            container.y =
                flewTo.y +
                ((start.y - flewTo.y) * (totalElapsed - FLY_TO_TIME)) /
                    FLY_BACK_TIME
        } else {
            container.x = start.x
            container.y = start.y
            return 'remove'
        }
        return undefined
    }
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

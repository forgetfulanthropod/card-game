import type {
    CharacterMeta,
    CharacterUid,
    NetworkAttackData,
    NetworkDOTData,
    NetworkEvent,
} from '@shared'
import type { SCursor } from 'baobab'
import { filters } from 'pixi.js'

import { getSocket } from '@/connection'
import { getBattleScene } from '@/data/rootTree'
import type { PixiContainer, PixiSprite } from '@/elementsUtil'
import {
    Container,
    flashElement,
    flashTo,
    hideElement,
    PixiTicker,
    Sprite,
} from '@/elementsUtil'
import { keys } from '@/util'

import { assetIdToSrc } from '../logic/assetGetters'
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

interface CharacterProps {
    onClick: (c: CharacterUid) => void
    scale: number
    cursor: SCursor<CharacterMeta>
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
        hasMovedSprite,
        initialHeight,
    } = sprites

    const mainContainer = Container({
        zIndex: args.zIndex,
        children: [
            mainSprite,
            selectedSprite,
            attackSprite,
            defendSprite,
            hasMovedSprite,
            healthBar,
        ],
    })
    mainContainer.sortChildren()

    const aboveCharacterContainer = Container({
        x: 0,
        y: -initialHeight,
        children: [],
    })

    const flyingContainer = Container({
        name: 'FlyingContainer',
        x: screenX,
        y: screenY,
        children: [mainContainer, aboveCharacterContainer],
    })

    // ---Functions and listeners---

    function onHeight(height: number) {
        aboveCharacterContainer.y = -height
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

    bindDOT(characterMeta, aboveCharacterContainer)

    bindMoves(
        characterMeta,
        attackSprite,
        healthBar,
        screenX,
        screenY,
        flyingContainer,
        defendSprite,
        aboveCharacterContainer
    )

    updateDeathAndHealth()

    return flyingContainer
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
    screenX: number,
    screenY: number,
    flyingContainer: PixiContainer,
    defendSprite: PixiSprite,
    aboveCharacterContainer: PixiContainer
) {
    getSocket().on(
        'move$',
        function showCharMove(event: NetworkEvent<'move$', NetworkAttackData>) {
            const { attackerUid, defenderUids, moveName, damageKVs } =
                event.data

            const thisUid = characterMeta.uid
            if (attackerUid === thisUid) {
                flashElement(attackSprite, {
                    durationMs: ATTACK_ANIMATION_TIME,
                })
                hideElement(healthBar, { durationMs: ATTACK_ANIMATION_TIME })
                const defender0 = getBattleScene()
                    .select('allCharacters')
                    .select(defenderUids[0])
                    .get()
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
                flashElement(defendSprite, {
                    durationMs: ATTACK_ANIMATION_TIME,
                })
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

    const hasMovedCursor = args.cursor.select('hasMoved')

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
        src: assetIdToSrc(assetIdCursor.get()),
        anchor: [0, 1] as [number, number],
        height: assetIdToSrc(assetIdCursor.get()).height,
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
    const hasMovedSprite = Sprite({
        ...charSpriteProps,
        filters: [grayFilter],
        zIndex: 2,
        visible: hasMovedCursor.get(),
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

    hasMovedCursor.on('update', () => {
        const newVal = hasMovedCursor.get()
        hasMovedSprite.visible = newVal
    })

    assetIdCursor.on('update', () => {
        // tl('asset update')
        const texture = assetIdToSrc(assetIdCursor.get())
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
        update(hasMovedSprite)
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
        hasMovedSprite,
        initialHeight: charSpriteProps.height,
    }
}

const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * 0.6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME
type Point = { x: number; y: number }

function makeFlyToOnTick(start: Point, flyTo: Point) {
    let totalElapsed = 0
    return (container: PixiContainer, elapsed: number): void | 'remove' => {
        // const deltaTimeMs = elapsed * 1000 / 60
        totalElapsed += elapsed * 16.66
        if (totalElapsed < FLY_TO_TIME) {
            container.x =
                start.x + ((flyTo.x - start.x) * totalElapsed) / FLY_TO_TIME
            container.y =
                start.y + ((flyTo.y - start.y) * totalElapsed) / FLY_TO_TIME
        } else if (totalElapsed < FLY_TIME) {
            container.x =
                flyTo.x +
                ((start.x - flyTo.x) * (totalElapsed - FLY_TO_TIME)) /
                    FLY_BACK_TIME
            container.y =
                flyTo.y +
                ((start.y - flyTo.y) * (totalElapsed - FLY_TO_TIME)) /
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

import type { CharacterMeta, CharacterUid, MyCursor, NetworkAttackData, NetworkEvent } from '@shared'
import { filters, Loader } from 'pixi.js'

import { getBattleScene } from '@/data/rootTree'
import { doFlashElement, flashElement, hideElement } from '@/util/pixiUtils'

import type { CharacterName } from '../logic/AssetLoader'
import type { Move$ } from './BattleScene'
import HealthBar from './HealthBar'
import HitInfo from './HitInfo'
import LevelUp from './LevelUp'
import MoveInfo from './MoveInfo'
import type { PixiContainer, PixiSprite, PixiTexture } from './mypixi'
import { Container, PixiTicker, Sprite } from './mypixi'


// const config = {
//     isHealthNumber: false
// }

const RED = 0xFF0000
const BLUE = 0x0000FF
const YELLOW = 0xe4e42d
const SHOW_HIT_TIME = 1000
const SHOW_LEVEL_UP_TIME = 2000
const ATTACK_ANIMATION_TIME = 1000
// const HEALTH_CHANGE_WAIT_TIME = 300

export function Frogknight(props: KnownPlayerCharacterProps): PixiContainer {
    return Character({ direction: -1, ...props })
}
export function Skeleton(props: KnownCharacterProps): PixiContainer {
    return Character({ direction: -1, ...props })
}
interface KnownCharacterProps {
    onClick: (c: CharacterUid) => void
    // dispatch: Dispatcher
    move$: Move$
    scale: number
    cursor: MyCursor<CharacterMeta>
}
interface KnownPlayerCharacterProps extends KnownCharacterProps {
    isSelected: boolean
}
interface CharacterProps extends KnownCharacterProps {
    isSelected?: boolean
    direction: -1 | 1
}

function Character(args: CharacterProps): PixiContainer {
    // NOTE: necessary so the onClick sends the correct data after a character change.
    const characterMeta = { ...args.cursor.get() }
    args.cursor.on('update', () => { Object.assign(characterMeta, args.cursor.get()) })
    const { screenX, screenY } = characterMeta


    // ---Sprites and containers---

    let healthBar = HealthBar({ value: characterMeta.health, max: characterMeta.maxHealth, stance: characterMeta.stance, effects: characterMeta.effects })

    const sprites = makeSprites(args, characterMeta, onHeight)
    if (sprites == null) {
        return Container({ children: [] })
    }
    const { attackSprite, defendSprite, mainSprite, selectedSprite, hasMovedSprite, initialHeight } = sprites

    const mainContainer = Container({
        children: [
            mainSprite,
            selectedSprite,
            attackSprite,
            defendSprite,
            hasMovedSprite,
            healthBar,
        ]
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
        children: [
            mainContainer,
            aboveCharacterContainer,
        ]
    })


    // ---Functions and listeners---

    function onHeight(height: number) { aboveCharacterContainer.y = -height }

    function updateDeathAndHealth() {
        const char = args.cursor.get()
        if (char == null) return

        if (char.health <= 0) {
            flyingContainer.removeChildren()
        } else {
            mainContainer.removeChild(healthBar)
            healthBar = HealthBar({ value: char.health, max: characterMeta.maxHealth, stance: characterMeta.stance, effects: char.effects })
            mainContainer.addChild(healthBar)
        }
    }

    args.cursor.select('health').on('update', updateDeathAndHealth)
    args.cursor.select('effects').on('update', updateDeathAndHealth)
    args.cursor.select('level').on('update', () => {
        doFlashElement(
            aboveCharacterContainer,
            () => LevelUp({ level: args.cursor.select('level').get() }),
            { durationMs: SHOW_LEVEL_UP_TIME }
        )
    })

    // const [isHovering, setIsHovering] = useState(false)

    args.move$.on(function doCharMove(event: NetworkEvent<'move', NetworkAttackData>) {
        const { attacker, defenders, move, damageMap } = event.data
        // console.log("doCharMove of", JSON.stringify(d))
        const myId = characterMeta.uid
        if (attacker === myId) {
            flashElement(attackSprite, { durationMs: ATTACK_ANIMATION_TIME })
            hideElement(healthBar, { durationMs: ATTACK_ANIMATION_TIME })
            const defender0 = getBattleScene().select('allCharacters').select(defenders[0]).get()
            const fly = makeFlyToOnTick({ x: screenX, y: screenY }, { x: defender0.screenX, y: defender0.screenY })
            PixiTicker.shared.add(function cb(dt) {
                const result = fly(flyingContainer, dt)
                if (result === 'remove')
                    PixiTicker.shared.remove(cb)
            })
            const charDamage = damageMap.find(d => d.key === myId)?.damage ?? null
            if (charDamage != null)
                doFlashElement(
                    aboveCharacterContainer,
                    () => HitInfo({ damage: charDamage, isPoison: true }),
                    { durationMs: SHOW_HIT_TIME }
                )
        }

        if (defenders.findIndex(d => d === myId) > -1) {
            flashElement(defendSprite, { durationMs: ATTACK_ANIMATION_TIME })
            doFlashElement(aboveCharacterContainer, () => MoveInfo({ move: move, offset: - 70 }), { durationMs: SHOW_HIT_TIME })
            const damageObj = damageMap.find(d => d.key === myId)
            if (damageObj == null) {
                console.warn(`damageMap did not provide value for defender with id ${myId}. damageMap:`, damageMap)
                return
            }
            doFlashElement(aboveCharacterContainer, () => HitInfo({ damage: damageObj.damage }), { durationMs: SHOW_HIT_TIME })
        }
    })

    return flyingContainer
}

function makeSprites(args: CharacterProps, characterMeta: CharacterMeta, onHeight: (height: number) => void) {

    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 10
    const grayFilter = new filters.ColorMatrixFilter()
    grayFilter.saturate(-.7, false)
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)

    const hasMovedCursor = args.cursor.select('hasMoved')

    const assetIdCursor = args.cursor.select('name')
    const assetIdToSrc = (assetId: CharacterName) => Loader.shared.resources?.[assetId]?.texture as PixiTexture

    if (assetIdCursor.get() == null) {
        // TODO: has to do with renewChildren()
        // should never occur...
        console.error('null character assetId. probably character was removed or uid was changed.')
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
        zIndex: 1
    })
    const defendSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: RED, zIndex: 0, visible: false })
    const attackSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: BLUE, zIndex: 0, visible: false })
    const hasMovedSprite = Sprite({ ...charSpriteProps, filters: [grayFilter], zIndex: 2, visible: hasMovedCursor.get() })
    // props.isSelected && !props.characterMeta.hasMoved
    const selectedId = getBattleScene().select('selectedCharacter')
    const selectedSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: YELLOW, name: 'glow', zIndex: 0, visible: selectedId.get() === characterMeta.uid })

    hasMovedCursor.on('update', () => {
        hasMovedSprite.visible = hasMovedCursor.get()
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

    return { attackSprite, defendSprite, mainSprite, selectedSprite, hasMovedSprite, initialHeight: charSpriteProps.height }
}


const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * .6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME
type Point = { x: number, y: number }

function makeFlyToOnTick(start: Point, flyTo: Point) {
    let totalElapsed = 0
    return (container: PixiContainer, elapsed: number): void | 'remove' => {
        // const deltaTimeMs = elapsed * 1000 / 60
        totalElapsed += elapsed * 16.66
        if (totalElapsed < FLY_TO_TIME) {
            container.x = start.x + (flyTo.x - start.x) * totalElapsed / FLY_TO_TIME
            container.y = start.y + (flyTo.y - start.y) * totalElapsed / FLY_TO_TIME
        } else if (totalElapsed < FLY_TIME) {
            container.x = flyTo.x + (start.x - flyTo.x) * (totalElapsed - FLY_TO_TIME) / FLY_BACK_TIME
            container.y = flyTo.y + (start.y - flyTo.y) * (totalElapsed - FLY_TO_TIME) / FLY_BACK_TIME
        } else {
            container.x = start.x
            container.y = start.y
            return 'remove'
        }
        return undefined
    }
}

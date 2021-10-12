import { MyCursor } from '@/config/myBaobab'
import dispatch from '@@/logic/dispatch'
import { getBattleScene } from '@/data/rootTree'
import { AttackData, CharacterMeta } from '@/data/types'
import { MoveEmitter } from '@/types'
import { doFlashElement, flashElement, hideElement } from '@/util/pixiUtils'
import { filters, Loader } from 'pixi.js'
// import { useLoaderContext } from '../providers/LoaderProvider'
import { getDamage } from '../../../data/battle/attack'
import { CharacterName } from '../logic/AssetLoader'
// import { MoveEmitter } from '../components/AllCharacters'
// import { Dispatcher } from '../components/CharacterManager'
// import { Hover } from './Hover'
import HealthBar from './HealthBar'
import HitInfo from './HitInfo'
import MoveInfo from './MoveInfo'
import { Container, PixiContainer, PixiSprite, PixiTexture, PixiTicker, Sprite } from './mypixi'
const config = {
    isHealthNumber: false
}

const RED = 0xFF0000
const BLUE = 0x0000FF
const YELLOW = 0xe4e42d
const SHOW_HIT_TIME = 1000
const ATTACK_ANIMATION_TIME = 1000
const HEALTH_CHANGE_WAIT_TIME = 300

export function Frogknight(props: KnownPlayerCharacterProps): PixiContainer {
    return Character({ direction: -1, ...props })
}
export function Skeleton(props: KnownCharacterProps): PixiContainer {
    return Character({ direction: -1, ...props })
}
interface KnownCharacterProps {
    onClick: (c: CharacterMeta) => void
    // dispatch: Dispatcher
    move$: MoveEmitter
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

    let healthBar = HealthBar({ value: characterMeta.health, max: characterMeta.maxHealth, stance: characterMeta.stance })

    const { attackSprite, defendSprite, mainSprite, selectedSprite, hasMovedSprite, initialHeight } = makeSprites(args, characterMeta, onHeight)

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

    args.cursor.select('health').on('update', () => {
        const value = args.cursor.select('health').get()
        mainContainer.removeChild(healthBar)

        if (value <= 0) {
            flyingContainer.removeChildren()
        } else {
            healthBar = HealthBar({ value, max: characterMeta.maxHealth, stance: characterMeta.stance })
            mainContainer.addChild(healthBar)
        }

    })

    // const [isHovering, setIsHovering] = useState(false)

    args.move$.on('', function doCharMove(d: AttackData) {
        // console.log("doCharMove of", JSON.stringify(d))
        const myId = characterMeta.uid
        if (d.attacker.uid === myId) {
            flashElement(attackSprite, { durationMs: ATTACK_ANIMATION_TIME })
            hideElement(healthBar, { durationMs: ATTACK_ANIMATION_TIME })
            const fly = makeFlyToOnTick({ x: screenX, y: screenY }, { x: d.defenders[0].screenX, y: d.defenders[0].screenY })
            PixiTicker.shared.add(function cb(dt) {
                const result = fly(flyingContainer, dt)
                if (result === 'remove')
                    PixiTicker.shared.remove(cb)
            })

        }

        if (d.defenders.findIndex(d => d.uid === myId) > -1) {
            // debugger
            const damage = getDamage(d)
            flashElement(defendSprite, { durationMs: ATTACK_ANIMATION_TIME })
            doFlashElement(aboveCharacterContainer, () => MoveInfo({ move: d.move, offset: - 70 }), { durationMs: SHOW_HIT_TIME })
            doFlashElement(aboveCharacterContainer, () => HitInfo({ damage: damage }), { durationMs: SHOW_HIT_TIME })
            // TODO: should characters update their own health?
            setTimeout(() => dispatch({ a: 'setHealth', uid: myId, h: h => (h - damage) }), HEALTH_CHANGE_WAIT_TIME)
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
    const charSpriteProps = {
        src: assetIdToSrc(assetIdCursor.get()),
        anchor: [0, 1] as [number, number],
        height: assetIdToSrc(assetIdCursor.get()).height,
    }

    const mainSprite = Sprite({
        ...charSpriteProps,
        name: 'mainCharacterSprite',
        onClick: () => {
            args.onClick(characterMeta)
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

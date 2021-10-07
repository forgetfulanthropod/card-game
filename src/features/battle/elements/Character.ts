import { useResetState } from 'hooks'
import { filters, Loader } from 'pixi.js'
import { Sprite, Container, PixiContainer, PixiSprite, PixiTicker } from './mypixi'
// import { MoveEmitter } from '../components/AllCharacters'
// import { Dispatcher } from '../components/CharacterManager'
// import { Hover } from './Hover'
import HealthBar from './HealthBar'
// import { useLoaderContext } from '../providers/LoaderProvider'
import { getDamage } from '../../../data/battle/attack'
import FlyingContainer from './FlyingContainer'
import HitInfo from './HitInfo'
import MoveInfo from './MoveInfo'
import { EventEmitter } from 'eventemitter3'
import dispatch from 'data/battle/dispatch'
import { MoveEmitter } from './AllCharacters'
import { tl } from '../logic/allCharactersLogic'
import { MyCursor } from 'config/myBaobab'
import { CharacterAssetKey, characterAssetKeys } from '../logic/AssetLoader'
import { getScene } from 'data/rootTree'
const config = {
    isHealthNumber: false
}

const RED = 0xFF0000
const BLUE = 0x0000FF
const YELLOW = 0xe4e42d
const SHOW_HIT_TIME = 1000
const ATTACK_ANIMATION_TIME = 1000

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
    args.cursor.on('update', () => {
        Object.assign(characterMeta, args.cursor.get())
    })

    // const characterMeta = args.cursor.get()
    // args.cursor.on('update', () => {
    //     Object.assign(characterMeta, args.cursor.get())
    // })
    const { screenX, screenY } = characterMeta
    // NEXT: HEALTH

    args.cursor.select('health').on('update', () => {
        const value = args.cursor.select('health').get()
        mainContainer.removeChild(healthBar)

        if (value <= 0) {
            flyingContainer.removeChildren()
        } else {
            healthBar = HealthBar({ value, max: characterMeta.maxHealth })
            mainContainer.addChild(healthBar)
        }

    })

    // const [currentMove, setCurrentMove] = useResetState<MoveMeta | null>(null, SHOW_HIT_TIME)
    // const [damageShown, setDamageShown] = useResetState<number | null>(null, SHOW_HIT_TIME)
    // const [isHovering, setIsHovering] = useState(false)

    const currentMove = characterMeta.moves[0]
    const damageShown = 10
    // const isHovering = false
    // const { isBasicLoaded } = useLoaderContext()

    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 10
    const grayFilter = new filters.ColorMatrixFilter()
    grayFilter.saturate(-.7, false)
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)

    const assetIdCursor = args.cursor.select('assetId')
    const assetIdToSrc = (assetId: CharacterAssetKey) => Loader.shared.resources?.[assetId]?.data
    const charSpriteProps = {
        // src: Loader.shared.resources?.[args.assetId]?.data,
        src: assetIdToSrc(assetIdCursor.get()),
        anchor: [0, 1] as [number, number],
        height: assetIdToSrc(assetIdCursor.get()).height,
    }
    assetIdCursor.on('update', () => {
        // tl('asset id updated')
        // TODO: better pattern for this?
        charSpriteProps.src = assetIdToSrc(assetIdCursor.get())
        charSpriteProps.height = assetIdToSrc(assetIdCursor.get()).height
        mainContainer.removeChild(lastMainSprite)
        lastMainSprite = mainSprite()
        mainContainer.addChild(lastMainSprite)
    })


    const mainSprite = () => Sprite({
        // const mainSprite = Sprite({
        ...charSpriteProps,
        name: 'mainCharacterSprite',
        onClick: () => {
            args.onClick(characterMeta)
        },
        zIndex: 1
    })
    let lastMainSprite = mainSprite()

    const defendSprite = () => Sprite({ ...charSpriteProps, filters: [blurFilter], tint: BLUE, zIndex: 0 })

    const attackSprite = () => Sprite({ ...charSpriteProps, filters: [blurFilter], tint: RED, zIndex: 0 })
    // props.isSelected && !props.characterMeta.hasMoved
    const selectedSprite = () => Sprite({ ...charSpriteProps, filters: [blurFilter], tint: YELLOW, name: 'glow', zIndex: 0 })
    const scCursor = getScene().select('selectedCharacter').select('id')
    const isInitiallySelected = scCursor.get() === characterMeta.id
    // tl(`I, ${characterMeta.id}, am selected`)
    scCursor.on('update', () => {
        // TODO: abstract or refactor
        if (scCursor.get() === characterMeta.id) {
            mainContainer.addChild(selectedSprite())
            mainContainer.sortChildren()
        } else {
            const expiredGlowSprite = mainContainer.children.find(c => c.name === 'glow')
            if (expiredGlowSprite != null) {
                mainContainer.removeChild(expiredGlowSprite)
                expiredGlowSprite.destroy()
            }
        }
    })
    args.move$.on('', function doCharMove(d: AttackData) {
        const myId = characterMeta.id
        if (d.attacker.id === myId) {
            flashSprite(mainContainer, attackSprite(), { destroy: true, durationMs: 500 })
            dispatch({ a: 'setHasMoved', id: myId, v: true })
            // setFlyTo({ x: d.defenders[0].screenX, y: d.defenders[0].screenY, })
            const fly = makeFlyToOnTick({ x: screenX, y: screenY }, { x: d.defenders[0].screenX, y: d.defenders[0].screenY })
            PixiTicker.shared.add(function cb(dt) {
                const result = fly(flyingContainer, dt)
                if (result === 'remove')
                    PixiTicker.shared.remove(cb)
            })

        }
        // else {
        //     setFlyTo(undefined)
        // }

        if (d.defenders.findIndex(d => d.id === myId) > -1) {
            const damage = getDamage(d)
            flashSprite(mainContainer, defendSprite(), { destroy: true })
            flashSprite(aboveCharacterContainer, MoveInfo({ move: d.move, offset: - 70 }), { destroy: true, durationMs: 1000 })
            flashSprite(aboveCharacterContainer, HitInfo({ damage: damage }), { destroy: true, durationMs: 1000 })
            // setDamageShown(damage)
            // toast.custom(<DamageToast left={x} top={y}>damage: {damage}</DamageToast>)
            // TODO: should characters update their own health?
            setTimeout(() => dispatch({ a: 'setHealth', id: myId, h: h => (h - damage) }), 300)
        }
    })

    let healthBar = HealthBar({ value: characterMeta.health, max: characterMeta.maxHealth })

    const mainContainer = Container({
        children: [
            // attackSprite,
            // mainSprite,
            lastMainSprite,
            isInitiallySelected && selectedSprite(),
            healthBar,
            // props.characterMeta.hasMoved && Sprite({ ...charSpriteProps, filters: [grayFilter] }),

        ]
    })
    mainContainer.sortChildren()

    const aboveCharacterContainer = Container({
        x: 0,
        y: -charSpriteProps.height,
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

    return flyingContainer
}


function flashSprite(parent: PixiContainer, sprite: PixiSprite, { durationMs = 500, destroy = false } = {}) {
    // tl('flashing')
    parent.addChild(sprite)

    parent.sortChildren()
    setTimeout(() => {
        if (parent != null) {
            parent.removeChild(sprite)
            if (destroy) {
                sprite.destroy()
            }
        }
    }, durationMs)
}



const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * .6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME
type Point = { x: number, y: number }
function makeFlyToOnTick(start: Point, flyTo: Point) {
    let totalElapsed = 0
    return (self: PixiContainer, elapsed: number): void | 'remove' => {
        // const deltaTimeMs = elapsed * 1000 / 60
        totalElapsed += elapsed * 16.66
        let x: number, y: number
        if (totalElapsed < FLY_TO_TIME) {
            x = start.x + (flyTo.x - start.x) * totalElapsed / FLY_TO_TIME
            y = start.y + (flyTo.y - start.y) * totalElapsed / FLY_TO_TIME
        } else if (totalElapsed < FLY_TIME) {
            x = flyTo.x + (start.x - flyTo.x) * (totalElapsed - FLY_TO_TIME) / FLY_BACK_TIME
            y = flyTo.y + (start.y - flyTo.y) * (totalElapsed - FLY_TO_TIME) / FLY_BACK_TIME
        } else {
            x = start.x
            y = start.y
            return 'remove'
        }
        self.x = x
        self.y = y
        return undefined
    }
}

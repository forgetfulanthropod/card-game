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
const config = {
    isHealthNumber: false
}

const RED = 0xFF0000
const BLUE = 0x0000FF
const SHOW_HIT_TIME = 1000
const ATTACK_ANIMATION_TIME = 1000

export function Frogknight(props: KnownPlayerCharacterProps): PixiContainer {
    return Character({ assetId: 'frogknight', direction: -1, ...props })
}
export function Skeleton(props: KnownCharacterProps): PixiContainer {
    return Character({ assetId: 'orcWarrior', direction: -1, ...props })
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
    assetId: string
    direction: -1 | 1
}
function Character(args: CharacterProps): PixiContainer {
    const characterMeta = args.cursor.get()
    args.cursor.on('update', () => {
        Object.assign(characterMeta, args.cursor.get())
    })
    const { screenX, screenY } = characterMeta
    // NEXT: HEALTH

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


    const charSpriteProps = {
        src: Loader.shared.resources?.[args.assetId]?.data,
        anchor: [0, 1] as [number, number],
        height: Loader.shared.resources?.[args.assetId]?.data?.height,
    }

    const mainSprite = Sprite({
        ...charSpriteProps,
        onClick: () => {
            args.onClick(characterMeta)
        },
        zIndex: 1
    })

    const defendSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: BLUE, zIndex: 1 })

    const attackSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: RED, zIndex: 0 })
    // props.isSelected && !props.characterMeta.hasMoved
    const selectedSprite = Sprite({ ...charSpriteProps, filters: [blurFilter] })


    args.move$.addListener('move', function doCharMove(d: AttackData) {
        const myId = characterMeta.id
        if (d.attacker.id === myId) {
            flashSprite(mainContainer, attackSprite)
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
            flashSprite(mainContainer, MoveInfo({ move: d.move, offset: -70 }), { destroy: true })
            flashSprite(flyingContainer, HitInfo({ damage: damage }), { destroy: true })
            // setDamageShown(damage)
            // toast.custom(<DamageToast left={x} top={y}>damage: {damage}</DamageToast>)
            // TODO: should characters update their own health?
            // dispatch
            // setTimeout(() => props.dispatch({ a: 'setHealth', id: myId, h: h => (h - damage) }), 300)
            // setCurrentMove(d.move)
        }
        // else {
        //     setCurrentMove(null)
        // }
    })
    // if (props.assetId === 'orcWarrior') {
    //     debugger
    // }

    // if (!isBasicLoaded) return <></>
    // {health > 0 ? <>
    // return Sprite(charSpriteProps)
    const mainContainer = Container({
        children: [
            // attackSprite,
            mainSprite,
            // Sprite({
            //     ...charSpriteProps, onClick: () => {
            //         //  pixiPreactChannel.emit("showAttackInfo")
            //         props.onClick(props.characterMeta)
            //     }
            // }),
            // props.characterMeta.hasMoved && Sprite({ ...charSpriteProps, filters: [grayFilter] }),
            // HealthBar({ value: health, max: props.characterMeta.maxHealth })
        ]
    })

    const flyingContainer = Container({
        name: 'FlyingContainer',
        x: screenX,
        y: screenY,
        children: [
            mainContainer,
            Container({
                x: 0,
                y: -charSpriteProps.height * .8,
                children: [
                    mainContainer,
                ],
            })
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

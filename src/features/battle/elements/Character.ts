import { MyCursor } from 'config/myBaobab'
import dispatch from 'data/battle/dispatch'
import { getScene } from 'data/rootTree'
import { filters, Loader } from 'pixi.js'
import { doFlashSprite, flashSprite } from 'util/pixiUtils'
// import { useLoaderContext } from '../providers/LoaderProvider'
import { getDamage } from '../../../data/battle/attack'
import { CharacterAssetKey } from '../logic/AssetLoader'
import { MoveEmitter } from './AllCharacters'
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
    args.cursor.on('update', () => {
        Object.assign(characterMeta, args.cursor.get())
    })
    const { screenX, screenY } = characterMeta

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

    // const [isHovering, setIsHovering] = useState(false)

    const currentMove = characterMeta.moves[0]
    const damageShown = 10

    const onHeight = (height: number) => {
        aboveCharacterContainer.y = -height
    }
    const { attackSprite, defendSprite, mainSprite, selectedSprite, initialHeight } = makeSprites(args, characterMeta, onHeight)
    args.move$.on('', function doCharMove(d: AttackData) {
        const myId = characterMeta.id
        if (d.attacker.id === myId) {
            flashSprite(attackSprite, { durationMs: ATTACK_ANIMATION_TIME })
            dispatch({ a: 'setHasMoved', id: myId, v: true })
            const fly = makeFlyToOnTick({ x: screenX, y: screenY }, { x: d.defenders[0].screenX, y: d.defenders[0].screenY })
            PixiTicker.shared.add(function cb(dt) {
                const result = fly(flyingContainer, dt)
                if (result === 'remove')
                    PixiTicker.shared.remove(cb)
            })

        }

        if (d.defenders.findIndex(d => d.id === myId) > -1) {
            const damage = getDamage(d)
            flashSprite(defendSprite, { durationMs: ATTACK_ANIMATION_TIME })
            doFlashSprite(aboveCharacterContainer, () => MoveInfo({ move: d.move, offset: - 70 }), { durationMs: SHOW_HIT_TIME })
            doFlashSprite(aboveCharacterContainer, () => HitInfo({ damage: damage }), { durationMs: SHOW_HIT_TIME })
            // TODO: should characters update their own health?
            setTimeout(() => dispatch({ a: 'setHealth', id: myId, h: h => (h - damage) }), HEALTH_CHANGE_WAIT_TIME)
        }
    })

    let healthBar = HealthBar({ value: characterMeta.health, max: characterMeta.maxHealth })

    const mainContainer = Container({
        children: [
            mainSprite,
            selectedSprite,
            attackSprite,
            defendSprite,
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

    return flyingContainer
}

function makeSprites(args: CharacterProps, characterMeta: CharacterMeta, onHeight: (height: number) => void) {
    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 10
    const grayFilter = new filters.ColorMatrixFilter()
    grayFilter.saturate(-.7, false)
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)

    const assetIdCursor = args.cursor.select('assetId')
    const assetIdToSrc = (assetId: CharacterAssetKey) => Loader.shared.resources?.[assetId]?.texture as PixiTexture
    const charSpriteProps = {
        src: assetIdToSrc(assetIdCursor.get()),
        anchor: [0, 1] as [number, number],
        height: assetIdToSrc(assetIdCursor.get()).height,
    }
    assetIdCursor.on('update', () => {
        const texture = assetIdToSrc(assetIdCursor.get())
        const height = assetIdToSrc(assetIdCursor.get()).height
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


    const mainSprite = Sprite({
        ...charSpriteProps,
        name: 'mainCharacterSprite',
        onClick: () => {
            args.onClick(characterMeta)
        },
        zIndex: 1
    })
    const defendSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: BLUE, zIndex: 0, visible: false })
    const attackSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: RED, zIndex: 0, visible: false })
    // props.isSelected && !props.characterMeta.hasMoved
    const selectedId = getScene().select('selectedCharacter').select('id')
    const selectedSprite = Sprite({ ...charSpriteProps, filters: [blurFilter], tint: YELLOW, name: 'glow', zIndex: 0, visible: selectedId.get() === characterMeta.id })

    selectedId.on('update', () => {
        selectedSprite.visible = selectedId.get() === characterMeta.id
    })
    return { attackSprite, defendSprite, mainSprite, selectedSprite, initialHeight: charSpriteProps.height }
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

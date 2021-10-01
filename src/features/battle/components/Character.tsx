import { Container, Sprite } from '@inlet/react-pixi'
import { useResetState } from 'hooks'
import { filters, Loader } from 'pixi.js'
import React, { useState } from 'react'
import { useLoaderContext } from '../providers/LoaderContext'
import { getDamage } from '../util/attack'
import { MoveEmitter } from './AllCharacters'
import { Dispatcher } from './CharacterManager'
import FlyingContainer from './FlyingContainer'
// import { Hover } from './Hover'
import HealthBar from './HealthBar'
import HitInfo from './HitInfo'
import MoveInfo from './MoveInfo'




const config = {
    isHealthNumber: false
}

const RED = 0xFF0000
const BLUE = 0x0000FF
const SHOW_HIT_TIME = 1000
const ATTACK_ANIMATION_TIME = 1000

export function Frogknight(props: KnownPlayerCharacterProps): JSX.Element {
    return <Character assetId={'frogknight'} direction={-1} {...props} />
}
export function Skeleton(props: KnownCharacterProps): JSX.Element {
    return <Character assetId={'orcWarrior'} direction={-1} {...props} />
}
interface KnownCharacterProps {
    characterMeta: CharacterMeta
    onClick: (c: CharacterMeta) => void
    dispatch: Dispatcher
    move$: MoveEmitter
    scale: number
}
interface KnownPlayerCharacterProps extends KnownCharacterProps {
    isSelected: boolean
}
interface CharacterProps extends KnownCharacterProps {
    isSelected?: boolean
    assetId: string
    direction: -1 | 1
    characterMeta: CharacterMeta
}
function Character(props: CharacterProps): JSX.Element {
    const { screenX, screenY, health } = props.characterMeta
    const [isAttacking, setIsAttacking] = useResetState(false, ATTACK_ANIMATION_TIME)
    const [flyTo, setFlyTo] = useResetState<{ x: number, y: number } | undefined>(undefined, ATTACK_ANIMATION_TIME)
    const [isDefending, setIsDefending] = useResetState(false, ATTACK_ANIMATION_TIME)
    const [currentMove, setCurrentMove] = useResetState<MoveMeta | null>(null, SHOW_HIT_TIME)
    const [damageShown, setDamageShown] = useResetState<number | null>(null, SHOW_HIT_TIME)
    const [isHovering, setIsHovering] = useState(false)
    // useEffect(() => { if (props.characterMeta.id === '65-50') { console.log('character render') } })

    const { isBasicLoaded } = useLoaderContext()

    props.move$.useSubscription(function doCharMove(d) {
        const myId = props.characterMeta.id
        if (d.attacker.id === myId) {
            setIsAttacking(true)
            props.dispatch({ a: 'setHasMoved', id: myId, v: true })
            setFlyTo({ x: d.defenders[0].screenX, y: d.defenders[0].screenY, })
            console.log({ x: d.defenders[0].screenX, y: d.defenders[0].screenY, })
        } else {
            setFlyTo(undefined)
        }

        if (d.defenders.findIndex(d => d.id === myId) > -1) {
            // tl(`hit defender ${myId}`)
            setIsDefending(true)
            const damage = getDamage(d)
            setDamageShown(damage)
            // toast.custom(<DamageToast left={x} top={y}>damage: {damage}</DamageToast>)
            setTimeout(() => props.dispatch({ a: 'setHealth', id: myId, h: h => (h - damage) }), 300)
            setCurrentMove(d.move)
        } else {
            setCurrentMove(null)
        }
    })

    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 10
    const grayFilter = new filters.ColorMatrixFilter()
    grayFilter.saturate(-.7, false)
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)

    const charSpriteProps = {
        image: Loader.shared.resources?.[props.assetId]?.data,
        anchor: { x: 0, y: 1 },
        height: Loader.shared.resources?.[props.assetId]?.data?.height
    }
    // if (props.assetId === 'orcWarrior') {
    //     debugger
    // }

    if (!isBasicLoaded) return <></>
    return <>
        {health > 0 ? <>
            <FlyingContainer {...{ start: { x: screenX, y: screenY }, flyTo, scale: props.scale }}>
                <Container x={0} y={0}>
                    {isAttacking && <Sprite {...charSpriteProps} filters={[blurFilter]} tint={BLUE} />}
                    {isDefending && <Sprite {...charSpriteProps} filters={[blurFilter]} tint={RED} />}
                    {(props.isSelected && !props.characterMeta.hasMoved) && <Sprite {...charSpriteProps} filters={[blurFilter]} />}
                    <Sprite {...charSpriteProps} click={() => props.onClick(props.characterMeta)} interactive={true} />
                    {props.characterMeta.hasMoved && <Sprite {...charSpriteProps} filters={[grayFilter]} />}

                    <HealthBar value={health} max={props.characterMeta.maxHealth} />
                </Container>
                <Container x={0} y={- charSpriteProps.height * .8}>
                    {damageShown != null && <HitInfo damage={damageShown} />}
                    {currentMove != null && <MoveInfo move={currentMove} offset={damageShown != null ? -70 : 0} />}
                </Container>
            </FlyingContainer>
        </> :
            <></>
        }
    </>
}

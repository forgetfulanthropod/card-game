import React, { useState } from 'react'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { getDamage } from '../util/attack'
// import { DamageDiv, Health } from './Styles'
import { MoveEmitter } from './AllCharacters'
import type Action from './CharacterManager'
// import { Hover } from './Hover'
import HealthBar from './HealthBar'
import { useResetState } from 'hooks'

import { Container, Sprite } from '@inlet/react-pixi'
import { Dispatcher } from './CharacterManager'
import { filters, Loader } from 'pixi.js'
import HitInfo from './HitInfo'
import { useLoaderContext } from '../providers/LoaderContext'
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
    return <Character assetId={'skeleton'} direction={-1} {...props} />
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
    const { x, y, health } = props.characterMeta
    const [isAttacking, setIsAttacking] = useResetState(false, ATTACK_ANIMATION_TIME)
    const [isDefending, setIsDefending] = useResetState(false, ATTACK_ANIMATION_TIME)
    const [currentMove, setCurrentMove] = useResetState<MoveMeta | null>(null, SHOW_HIT_TIME)
    const [damageShown, setDamageShown] = useResetState<number | null>(null, SHOW_HIT_TIME)
    const [isHovering, setIsHovering] = useState(false)

    const { isBasicLoaded } = useLoaderContext()

    props.move$.useSubscription(function doCharMove(d) {
        const myId = props.characterMeta.id
        if (d.attacker.id === myId) {
            setIsAttacking(true)
            setCurrentMove(d.move)
            props.dispatch({ a: 'setHasMoved', id: myId, v: true })
        } else {
            setCurrentMove(null)
        }

        if (d.defenders.findIndex(d => d.id === myId) > -1) {
            // tl(`hit defender ${myId}`)
            setIsDefending(true)
            const damage = getDamage(d)
            setDamageShown(damage)
            // toast.custom(<DamageToast left={x} top={y}>damage: {damage}</DamageToast>)
            setTimeout(() => props.dispatch({ a: 'setHealth', id: myId, h: h => (h - damage) }), 300)
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
    console.log('height of ', props.assetId, ' is ', charSpriteProps.height * props.scale)

    if (!isBasicLoaded) return <></>
    return <>
        {health > 0 ? <>
            <Container x={x} y={y} scale={{ x: props.scale, y: props.scale }}>
                {isAttacking && <Sprite {...charSpriteProps} filters={[blurFilter]} tint={BLUE} />}
                {isDefending && <Sprite {...charSpriteProps} filters={[blurFilter]} tint={RED} />}
                {(props.isSelected && !props.characterMeta.hasMoved) && <Sprite {...charSpriteProps} filters={[blurFilter]} />}
                <Sprite {...charSpriteProps} click={() => props.onClick(props.characterMeta)} interactive={true} />
                {props.characterMeta.hasMoved && <Sprite {...charSpriteProps} filters={[grayFilter]} />}

                <HealthBar value={health} max={props.characterMeta.maxHealth} />
            </Container>
            <Container x={x} y={y - charSpriteProps.height * props.scale * .8}>
                {damageShown != null && <HitInfo damage={damageShown} />}
                {currentMove != null && <MoveInfo move={currentMove} />}
            </Container>
        </> :
            <></>
        }
    </>
}


{/* <div
                onClick={() => props.onClick(props.characterMeta)}
                style={{ position: 'absolute', left: x + '%', top: y + '%', width: '10%' }}
                onPointerEnter={() => setIsHovering(true)}
                onPointerLeave={() => setIsHovering(false)}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
                    {isHovering && <Hover characterMeta={props.characterMeta} />}
                    {damageShown != null && <DamageDiv>-{damageShown}</DamageDiv>}
                    <Sprite {...spriteProps} x={0} y={0} hasMoved={props.characterMeta.hasMoved} />
                    {(isAttacking || isDefending) ?
                        <>
                            <Sprite {...spriteProps} x={0} y={0} absolute={true} blur={true} />
                            <Sprite {...spriteProps} x={0} y={0} absolute={true} color={isAttacking ? 'blue' : (isDefending ? 'red' : '')} blur={true} />
                        </>
                        : (props.isSelected && !props.characterMeta.hasMoved) ?
                            <>
                                <Sprite {...spriteProps} x={0} y={0} absolute={true} glow={true} color={'white'} />
                                <Sprite {...spriteProps} x={0} y={0} absolute={true} />
                            </>
                            : null}
                    {config.isHealthNumber ?
                        <div style={{ position: 'absolute', bottom: '-3vw' }}>
                            <HealthBar value={health} max={props.characterMeta.maxHealth} />
                        </div> :
                        <Health color={props.characterMeta.isPc ? '#53C541' : 'red'}>{health}</Health>
                    }
                </div>
            </div> */}

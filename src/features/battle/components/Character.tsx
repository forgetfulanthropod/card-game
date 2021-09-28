import React, { useState } from 'react'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { getDamage } from '../util/attack'
// import { DamageDiv, Health } from './Styles'
import { Action, MoveEmitter } from './AllCharacters'
// import { Hover } from './Hover'
// import HealthBar from './HealthBar'
import { useResetState } from 'hooks'

import { Container, Sprite } from '@inlet/react-pixi'
import { filters } from 'pixi.js'


const config = {
    isHealthNumber: false
}

const RED = 0xFF0000
const BLUE = 0x0000FF

export function Frogknight(props: KnownPlayerCharacterProps): JSX.Element {
    return <Character src={frogknightPng} direction={-1} {...props} />
}
export function Skeleton(props: KnownCharacterProps): JSX.Element {
    return <Character src={skeletonPng} direction={-1} {...props} />
}
interface KnownCharacterProps {
    characterMeta: CharacterMeta
    onClick: (c: CharacterMeta) => void
    dispatch: React.Dispatch<Action>
    move$: MoveEmitter
}
interface KnownPlayerCharacterProps extends KnownCharacterProps {
    isSelected: boolean
}
interface CharacterProps extends KnownCharacterProps {
    isSelected?: boolean
    src: string
    direction: -1 | 1
    characterMeta: CharacterMeta
}
function Character(props: CharacterProps): JSX.Element {
    const { x, y, health } = props.characterMeta
    const [isAttacking, setIsAttacking] = useResetState(false, 500)
    const [isDefending, setIsDefending] = useResetState(false, 500)
    const [damageShown, setDamageShown] = useResetState<number | null>(null, 800)
    const [isHovering, setIsHovering] = useState(false)

    props.move$.useSubscription(function doCharMove(d) {
        const myId = props.characterMeta.id
        if (d.attacker.id === myId) {
            setIsAttacking(true)
            props.dispatch({ a: 'setHasMoved', id: myId, v: true })
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

    const spriteProps = {
        src: props.src,
        isAttacking,
        isDefending
    }
    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 10
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)
    return <>
        {health > 0 ?
            <Container x={x} y={y}>
                {isAttacking && <Sprite image={props.src} filters={[blurFilter]} tint={BLUE} />}
                {isDefending && <Sprite image={props.src} filters={[blurFilter]} tint={RED} />}
                {(props.isSelected && !props.characterMeta.hasMoved) && <Sprite image={props.src} filters={[blurFilter]} />}
                <Sprite image={props.src} click={() => props.onClick(props.characterMeta)} interactive={true} />
            </Container> :
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

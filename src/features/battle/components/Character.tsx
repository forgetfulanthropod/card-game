import React, { useEffect, useState } from 'react'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { getDamage } from '../util/attack'
import { Health, Sprite } from './Styles'
import { Action, MoveEmitter } from './AllCharacters'
import { Hover } from './Hover'
import HealthBar from './HealthBar'

const config = {
    isHealthNumber: false
}

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
    const [isAttacking, setIsAttacking] = useState(false)
    const [isDefending, setIsDefending] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    useEffect(() => {
        if (!isAttacking && !isDefending)
            return () => { }
        const t = setTimeout(() => {
            setIsAttacking(false)
            setIsDefending(false)
        }, 500)

        return () => clearTimeout(t)
    }, [isAttacking, isDefending])


    props.move$.useSubscription(d => {
        const myId = props.characterMeta.id
        if (d.attacker.id === myId) {
            setIsAttacking(true)
            props.dispatch({ type: 'setHasMoved', characterId: myId, hasMoved: true })
        }

        if (d.defenders.findIndex(d => d.id === myId) > -1) {
            setIsDefending(true)
            const damage = getDamage(d)
            setTimeout(() => props.dispatch({ type: 'setHealth', characterId: myId, health: h => (h - damage) }), 300)
        }
    })

    const spriteProps = {
        src: props.src,
        isAttacking,
        isDefending
    }
    return <>
        {health > 0 ?
            <div
                onClick={() => props.onClick(props.characterMeta)}
                style={{ position: 'absolute', left: x + '%', top: y + '%', width: '10%' }}
                onPointerEnter={() => setIsHovering(true)}
                onPointerLeave={() => setIsHovering(false)}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
                    {isHovering && <Hover characterMeta={props.characterMeta} />}
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
                        <Health color={props.characterMeta.isPlayerCharacter ? '#53C541' : 'red'}>{health}</Health>
                    }
                </div>
            </div> :
            <></>}
    </>
}

import { useEventEmitter } from 'ahooks'
import produce from 'immer'
import React, { useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { getDamage } from '../util/attack'
import { attackBus } from '../util/attackBus'
import { moveTypeMetaMap } from '../util/constants'
import { initialPlayerCharacters } from '../util/factories'
import { checkWinner, getPCTarget, getRandomMove, getUnmovedNpc, getUnmovedPc, getId, getClosest } from '../util/misc'
import { EnemyHoverDiv, Health, IdleScreenOverlay, PCHoverDiv, Sprite, Start } from './Styles'
import Table from './Table'

const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

const tl = (x: string) => { toast(x); console.log(x) }

type Set<T> = T | ((old: T) => T)


function makeInitialState() {
    const allCharacters = initialPlayerCharacters()
    const selectedCharacter = allCharacters.find(c => c.isPlayerCharacter)
    if (selectedCharacter == null) throw Error('no player characters!')
    return {
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: false,
        allCharacters,
        selectedCharacter,
        npcMove$: useEventEmitter(),
    }
}

type Action =
    | { type: 'setIsPlayerTurn', isPlayerTurn: boolean }
    | { type: 'setBattleHasBegun' }
    | { type: 'setHasMoved', characterId: string, hasMoved: boolean }
    | { type: 'setHealth', characterId: string, health: Set<number> }
    | { type: 'clearHasMoved' }
    | { type: 'setSelectedCharacter', character: CharacterMeta }

function reducer(state: ReturnType<typeof makeInitialState>, action: Action) {
    return produce(state, draft => {
        switch (action.type) {
            case 'setIsPlayerTurn': {
                draft.isPlayerTurn = action.isPlayerTurn
                return
            } case 'setBattleHasBegun': {
                draft.battleHasBegun = true
                return
            } case 'setHasMoved': {
                const c = draft.allCharacters.find(c => c.id === action.characterId)
                if (c == null) { console.error(`couldn't find character with id ${action.characterId}`); return }
                c.hasMoved = true
                return
            } case 'setHealth': {
                const c = draft.allCharacters.find(c => c.id === action.characterId)
                if (c == null) { console.error(`couldn't find character with id ${action.characterId}`); return }
                if (typeof action.health === 'function') {
                    c.health = action.health(c.health)
                } else {
                    c.health = action.health
                }
                return
            } case 'clearHasMoved': {
                draft.allCharacters.forEach(c => c.hasMoved = false)
                return
            } case 'setSelectedCharacter': {
                draft.selectedCharacter = action.character
                return
            } default:
                throw new Error(`unknown action ${action}`)
        }
    })
}




export default function AllCharacters(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, makeInitialState())
    const { npcMove$, allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state

    const winner = checkWinner(allCharacters)
    useEffect(() => { winner != null && tl(winner === 'PC' ? 'You win' : 'Computer wins') }, [winner])

    useEffect(() => {
        if (!battleHasBegun) return
        toast(isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!isPlayerTurn) npcMove$.emit()
    }, [battleHasBegun])


    npcMove$.useSubscription(function npcRebuttal() {
        if (checkWinner(allCharacters) != null) {
            return
        }

        const attacker = getUnmovedNpc(allCharacters)
        if (attacker == null) {
            dispatch({ type: 'clearHasMoved' })
            // trigger again so fires after state update
            npcMove$.emit()
            return
        }

        const defender = getPCTarget(allCharacters)
        const move = getRandomMove(attacker)
        // tl(`${attacker.id} will attack ${defender.id} with ${move.name}`)
        attackBus.emit({ attacker, defender, move })
        if (move.type === 'SL')
            attackBus.emit({ attacker, defender: getClosest(state.allCharacters, defender), move })

        dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: true })
    })



    const onClick = function doCharacterAction(character: CharacterMeta) {
        if (checkWinner(allCharacters) != null) {
            return
        }
        if (!isPlayerTurn) return

        if (character.isPlayerCharacter) {
            if (character.hasMoved) { return }

            dispatch({ type: 'setSelectedCharacter', character })
            return
        }
        // clicked on NPC
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            dispatch({ type: 'clearHasMoved' })
            return
        }
        attackBus.emit({
            attacker: selectedCharacter,
            defender: character,
            move: {
                name: 'Dutiful Stab',
                type: 'BA',
            }
        })
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            console.error('no player characters')
            dispatch({ type: 'clearHasMoved' })
            return
        }
        dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: false })
        dispatch({ type: 'setSelectedCharacter', character: newPc })
        setTimeout(() => npcMove$.emit(), TIME_AFTER_PLAYER_MOVE + 500)

    }

    return <div>
        {
            !battleHasBegun ?
                <IdleScreenOverlay>
                    <Start onClick={() => dispatch({ type: 'setBattleHasBegun' })} />
                </IdleScreenOverlay> :
                <></>
        }
        {allCharacters.map(characterMeta => {
            const { x, y } = characterMeta
            const id = getId(x, y)
            const characterProps = { dispatch, characterMeta, onClick, key: id }

            return characterMeta.isPlayerCharacter ?
                <Frogknight {...characterProps} isSelected={selectedCharacter?.id === id} /> :
                <Skeleton {...characterProps} />
        })}
    </div>
}


function Frogknight(props: KnownPlayerCharacterProps) {
    return <Character src={frogknightPng} direction={-1} {...props} />
}


function Skeleton(props: KnownCharacterProps) {
    return <Character src={skeletonPng} direction={-1} {...props} />
}

interface KnownCharacterProps {
    characterMeta: CharacterMeta
    onClick: (c: CharacterMeta) => void
    dispatch: React.Dispatch<Action>
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
        if (!isAttacking && !isDefending) return () => { }
        const t = setTimeout(() => {
            setIsAttacking(false)
            setIsDefending(false)
        }, 500)
        return () => clearTimeout(t)
    }, [isAttacking, isDefending])


    useEffect(() => {
        attackBus.subscribe((d: AttackData) => {
            const myId = props.characterMeta.id
            if (d.attacker.id === myId) {
                setIsAttacking(true)
                props.dispatch({ type: 'setHasMoved', characterId: myId, hasMoved: true })

            }

            if (d.defender.id === myId) {
                setIsDefending(true)


                //todo setSelectedMove

                props.dispatch({ type: 'setHasMoved', characterId: myId, hasMoved: true })
                const damage = getDamage(d)
                // setTimeout(() => props.setHealth(health => health - damage), 500)
                setTimeout(() => props.dispatch({ type: 'setHealth', characterId: myId, health: h => (h - damage) }), 500)

            }
        })
    }, [])

    const spriteProps = {
        src: props.src,
        isAttacking,
        isDefending
    }

    const midAttack = () => <>
        <Sprite {...spriteProps} x={5} y={0} blur={true} />
        <Sprite {...spriteProps} x={5} y={0} absolute={true} color={isAttacking ? 'blue' : (isDefending ? 'red' : '')} blur={true} />
    </>
    const selected = () => <>
        <Sprite {...spriteProps} x={0} y={0} glow={true} color={'white'} />
        <Sprite {...spriteProps} x={0} y={0} absolute={true} />
    </>
    const regular = () => <Sprite {...spriteProps} x={0} y={0} />

    const sprite = () => (isAttacking || isDefending) ? midAttack() : props.isSelected ? selected() : regular()
    return <>
        {health > 0 ?
            <div
                onClick={() => props.onClick(props.characterMeta)}
                style={{ position: 'absolute', left: x + '%', top: y + '%', width: '13%' }}
                onPointerEnter={() => setIsHovering(true)}
                onPointerLeave={() => setIsHovering(false)}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
                    {isHovering && <Hover characterMeta={props.characterMeta} />}
                    {sprite()}
                    <Health color={props.characterMeta.isPlayerCharacter ? '#53C541' : 'red'}>{health}</Health>
                    {/* <Health x={size?.width == null ? 10 : size.width / 2} y={size?.height == null ? 10 : size.height} color={props.color}>{health}</Health> */}
                </div>
            </div> :
            <></>}
    </>
}

function Hover(props: { characterMeta: CharacterMeta }) {
    const cm = props.characterMeta
    const moveAt = (i: number) => `${cm.moves[i].name} ${moveTypeMetaMap[cm.moves[i].type].multiplier * cm.damage | 0}`
    return <>{
        cm.isPlayerCharacter ?
            <PCHoverDiv>
                stance: {cm.stance}
            </PCHoverDiv> :
            <EnemyHoverDiv>
                <Table
                    header={cm.type}
                    rows={
                        [[`LVL ${cm.level}`, moveAt(0)],
                        [`HP ${cm.health}`, moveAt(1)],
                        [`ATK ${cm.damage}`, moveAt(2)]]
                    }
                />
            </EnemyHoverDiv>
    }
    </>
}

import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import produce from 'immer'
import React, { useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'
import frogknightPng from '../assets/Frog_Knight_sprite-200.png'
import skeletonPng from '../assets/Skeleton_Warrior_sprite-200.png'
import { getDamage } from '../util/attack'
import { moveTypeMetaMap } from '../util/constants'
import { initialPlayerCharacters } from '../util/factories'
import { checkWinner, getNpcAttack, getUnmovedPc, getId, getClosest, checkMoveAvailable } from '../util/misc'
import { EnemyHoverDiv, Health, IdleScreenOverlay, PCHoverDiv, Sprite, Start } from './Styles'
import Table from './Table'

const DEBUG = true
const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

const tl = (x: string) => { toast(x); console.log(x) }

type Set<T> = T | ((old: T) => T)


type AttackEmitter = EventEmitter<[
    { type: 'random' } | { type: 'chosen' } & AttackData,
    'manager' | 'character']>

function makeInitialState() {
    const allCharacters = initialPlayerCharacters()
    const selectedCharacter = allCharacters.find(c => c.isPlayerCharacter)
    if (selectedCharacter == null) throw Error('no player characters!')
    return {
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: false,
        allCharacters,
        selectedCharacter,
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
    const attack$: AttackEmitter = useEventEmitter()
    const [state, dispatch] = useReducer(reducer, makeInitialState())
    const { allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state

    const winner = checkWinner(allCharacters)
    useEffect(() => { winner != null && tl(winner === 'PC' ? 'You win' : 'Computer wins') }, [winner])

    useEffect(() => {
        if (!battleHasBegun) return
        toast(isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!isPlayerTurn) attack$.emit([{ type: 'random' }, 'manager'])
    }, [battleHasBegun])


    const isMoveAvailable = checkMoveAvailable(allCharacters)
    useEffect(() => {
        if (isMoveAvailable) return
        if (DEBUG) toast('resetting moves')
        dispatch({ type: 'clearHasMoved' })
    }, [isMoveAvailable])

    attack$.useSubscription(([attack, target]) => {
        if (target !== 'manager') { return }
        if (checkWinner(allCharacters) != null) {
            return
        }
        if (attack.type === 'random') {
            attack$.emit([{ type: 'chosen', ...getNpcAttack(allCharacters) }, 'manager'])
            return
        }

        attack$.emit([{ ...attack }, 'character'])
        if (attack.move.type === 'SL')
            attack$.emit([{ type: 'chosen', attacker: attack.attacker, defender: getClosest(state.allCharacters, attack.defender), move: attack.move }, 'character'])

        dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: true })
    })



    const onClick = function doCharacterAction(character: CharacterMeta) {
        if (checkWinner(allCharacters) != null) return
        if (!isPlayerTurn) return

        if (character.isPlayerCharacter) {
            if (character.hasMoved) { return }
            dispatch({ type: 'setSelectedCharacter', character })
            return
        }

        // clicked on NPC but no selected character
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            return
        }
        attack$.emit([{
            type: 'chosen',
            attacker: selectedCharacter,
            defender: character,
            move: {
                name: 'Dutiful Stab',
                type: 'BA',
            }
        }, 'manager']) // TODO: right target?
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            throw Error('no player characters')
        }
        dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: false })
        dispatch({ type: 'setSelectedCharacter', character: newPc })
        setTimeout(() => attack$.emit([{ type: 'random' }, 'manager']), TIME_AFTER_PLAYER_MOVE + 500)
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
            const characterProps = { attack$, dispatch, characterMeta, onClick, key: id }

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
    attack$: AttackEmitter
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


    props.attack$.useSubscription(([d, target]) => {
        if (target !== 'character' || d.type === 'random') { return }
        const myId = props.characterMeta.id
        if (d.attacker.id === myId) {
            setIsAttacking(true)
            props.dispatch({ type: 'setHasMoved', characterId: myId, hasMoved: true })
        }

        if (d.defender.id === myId) {
            setIsDefending(true)
            //todo setSelectedMove
            // props.dispatch({ type: 'setHasMoved', characterId: myId, hasMoved: true })
            const damage = getDamage(d)
            setTimeout(() => props.dispatch({ type: 'setHealth', characterId: myId, health: h => (h - damage) }), 300)
        }
    })

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
                    <Health color='white'>{props.characterMeta.hasMoved ? 'moved' : 'open'}</Health>
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

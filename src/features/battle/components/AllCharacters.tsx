import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import produce from 'immer'
import React, { useEffect, useReducer } from 'react'
import toast from 'react-hot-toast'
import { initialPlayerCharacters } from '../util/factories'
import { checkWinner, getNpcAttack, getUnmovedPc, getId, getClosest, checkMoveAvailable } from '../util/misc'
import { Frogknight, Skeleton } from './Character'
import { IdleScreenOverlay, Start } from './Styles'

export const DEBUG = false
const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

const tl = (x: string) => { toast(x); console.log(x) }

type Set<T> = T | ((old: T) => T)


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


export type AttackEmitter = EventEmitter<[
    { type: 'random' } | { type: 'chosen' } & AttackData,
    'manager' | 'character']>

export type Action =
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


function makeInitialState() {
    const allCharacters = initialPlayerCharacters()
    const selectedCharacter = allCharacters.find(c => c.isPlayerCharacter)
    if (selectedCharacter == null) throw Error('no player characters!')
    return Object.freeze({
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: false,
        allCharacters,
        selectedCharacter,
    })
}

import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import produce from 'immer'
import React, { useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'
import { makeInitialPlayerCharacters } from '../util/factories'
import { checkMoveAvailable, checkWinner, getId, getNpcMove, getUnmovedPc } from '../util/misc'
import { Frogknight, Skeleton } from './Character'
import { MoveButton, IdleScreenOverlay, Lose, MoveMenuDiv, Reset, Start } from './Styles'

export const DEBUG = false
const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

export const tl = (x: string): void => { toast(x); console.log(x) }

type Set<T> = T | ((old: T) => T)


export default function AllCharacters(props: { reset: () => void }): JSX.Element {
    const move$: MoveEmitter = useEventEmitter()
    const npcMove$: NpcMoveEmitter = useEventEmitter()
    const [state, dispatch] = useReducer(reducer, makeInitialState())
    const [isPlayerFirstTurn] = useState(state.isPlayerTurn)
    const { allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state
    const [showLose, setShowLose] = useState(false)

    move$.useSubscription(ad => {
        DEBUG && tl(`${ad.attacker.id} attacks ${ad.defenders.map(d => d.id)} with ${ad.move.name}`)
        tl(ad.move.name)
    })

    const winner = checkWinner(allCharacters)
    useEffect(() => {
        console.log(winner === 'PC' ? 'You win' : 'Computer wins')
        if (winner === 'NPC') {
            const st = setTimeout(() => setShowLose(true), 1000)
            return () => clearTimeout(st)
        }
        return () => { }
    }, [winner])

    useEffect(() => {
        if (!battleHasBegun) return () => { }
        tl(isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!isPlayerTurn) {
            const t = setTimeout(() => npcMove$.emit(), 1000)
            return () => clearTimeout(t)
        }
        return () => { }
    }, [battleHasBegun])


    const isMoveAvailable = checkMoveAvailable(allCharacters)
    useEffect(() => {
        if (isMoveAvailable) return
        if (DEBUG) tl('resetting moves')
        dispatch({ type: 'clearHasMoved' })
        dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: isPlayerFirstTurn })
        tl(isPlayerTurn ? 'You start' : 'Enemy starts')
        if (!isPlayerFirstTurn) {
            npcMove$.emit()
        }
    }, [isMoveAvailable])

    npcMove$.useSubscription(() => {
        if (!allCharacters.some(c => c.isPc && c.health > 0)) {
            // all PCs dead
            tl('all PC dead')
            return
        }
        if (!allCharacters.some(c => !c.isPc && c.health > 0 && !c.hasMoved)) {
            console.warn('xKK9M')
            // TODO: this should never occur
            // no NPCs with moves, give the turn back
            dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: true })
            return
        }
        move$.emit(getNpcMove(allCharacters))
        if (allCharacters.some(c => c.isPc && c.health > 0 && !c.hasMoved)) {
            tl('no unmoved PC')
            setTimeout(() => dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: true }), 500)
        }
        else if (allCharacters.some(c => !c.isPc && c.health > 0 && !c.hasMoved)) {
            setTimeout(() => npcMove$.emit(), 1000)
        }
    })

    const onClick = function doCharacterAction(character: CharacterMeta) {
        if (checkWinner(allCharacters) != null) return
        if (!isPlayerTurn) return

        if (character.isPc) {
            if (character.hasMoved) { return }
            dispatch({ type: 'setSelectedCharacter', character })
            return
        }

        // clicked on NPC but no selected character
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            return
        }
        if (state.selectedMove == null) {
            console.error('no selected move')
        } else {
            move$.emit({
                attacker: selectedCharacter,
                defenders: [character], // TODO: slash
                move: state.selectedMove,
            }) // TODO: right target?
        }
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            // TODO: this should never occur
            console.warn('WhcgK')
            dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: false })
            return
            // throw Error('no player characters')
        }
        dispatch({ type: 'setSelectedCharacter', character: newPc })
        if (allCharacters.some(c => !c.isPc && c.health > 0 && !c.hasMoved)) {
            dispatch({ type: 'setIsPlayerTurn', isPlayerTurn: false })
            setTimeout(() => npcMove$.emit(), TIME_AFTER_PLAYER_MOVE + 500)
        }
    }

    return <div>
        {
            !battleHasBegun &&
            <IdleScreenOverlay>
                <Start onClick={() => dispatch({ type: 'setBattleHasBegun' })} />
            </IdleScreenOverlay>
        }
        {
            showLose && <LoseScreen reset={props.reset} />
        }
        {allCharacters.map(characterMeta => {
            const { x, y } = characterMeta
            const id = getId(x, y)
            const characterProps = { move$, dispatch, characterMeta, onClick, key: id }

            return characterMeta.isPc ?
                <Frogknight {...characterProps} isSelected={selectedCharacter?.id === id} /> :
                <Skeleton {...characterProps} />
        })}
        {isPlayerTurn && <MoveMenu character={selectedCharacter} dispatch={dispatch} selectedMove={state.selectedMove?.type} />}
    </div>
}

function MoveMenu(props: { character: CharacterMeta, dispatch: React.Dispatch<Action>, selectedMove: string | undefined }) {
    return <MoveMenuDiv>
        {props.character.moves.map(m =>
            <MoveButton
                key={m.type}
                onClick={() => props.dispatch({ type: 'setSelectedMove', selectedMove: m })}
                isSelected={props.selectedMove === m.type}
            >
                {m.name}
            </MoveButton>
        )}
    </MoveMenuDiv>
}

export type MoveEmitter = EventEmitter<AttackData>
export type NpcMoveEmitter = EventEmitter<void>

export type Action =
    | { type: 'setIsPlayerTurn', isPlayerTurn: boolean }
    | { type: 'setBattleHasBegun' }
    | { type: 'setHasMoved', characterId: string, hasMoved: boolean }
    | { type: 'setHealth', characterId: string, health: Set<number> }
    | { type: 'clearHasMoved' }
    | { type: 'setSelectedCharacter', character: CharacterMeta }
    | { type: 'setSelectedMove', selectedMove: MoveMeta }


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
            } case 'setSelectedMove': {
                draft.selectedMove = action.selectedMove
                return
            } default:
                throw new Error(`unknown action ${action}`)
        }
    })
}


function makeInitialState() {
    const allCharacters = makeInitialPlayerCharacters()
    const selectedCharacter = allCharacters.find(c => c.isPc)
    const selectedMove = selectedCharacter?.moves[0]
    if (selectedCharacter == null) throw Error('no player characters!')
    return Object.freeze({
        isPlayerTurn: Math.random() < .5,
        battleHasBegun: true,
        allCharacters,
        selectedCharacter,
        selectedMove,
    })
}

function LoseScreen(props: { reset: () => void }): JSX.Element {
    return <IdleScreenOverlay>
        <Lose />
        <Reset onClick={props.reset}>Reset</Reset>
    </IdleScreenOverlay>
}

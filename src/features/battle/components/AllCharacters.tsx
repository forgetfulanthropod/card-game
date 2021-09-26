import { useEventEmitter } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import produce from 'immer'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'
import { moveTypeMetaMap } from '../util/constants'
import { makeInitialPlayerCharacters } from '../util/factories'
import { checkMoveAvailable, checkWinner, getClosestAlive, getId, getNpcMove, getUnmovedPc } from '../util/misc'
import { Frogknight, Skeleton } from './Character'
import { IdleScreenOverlay, Lose, MoveButton, MoveMenuDiv, Reset, Start } from './Styles'

export const DEBUG = false
const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

export const tl = (x: string): void => { console.log(x); toast(x) }

type Set<T> = T | ((old: T) => T)


export default function AllCharacters(props: { reset: () => void }): JSX.Element {
    const move$: MoveEmitter = useEventEmitter()
    const npcMove$: NpcMoveEmitter = useEventEmitter()
    const [state, dispatch] = useReducer(reducer, makeInitialState())
    const [isPlayerFirstTurn] = useState(state.isPlayerTurn)
    const { allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state
    const [showLose, setShowLose] = useState(false)

    const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
    const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)

    move$.useSubscription(function move(ad) {
        DEBUG && tl(`${ad.attacker.id} attacks ${ad.defenders.map(d => d.id)} with ${ad.move.name}`)
        toast(ad.move.name, {
            style: {
                backgroundColor: ad.attacker.isPc ? 'green' : 'red',
                color: 'white'
            }
        })
        console.log(ad.move.name)
        // tl(ad.move.name)
    })

    // useEffect(() => { tl(`is player turn: ${isPlayerTurn}`) }, [isPlayerTurn])

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
            const t = setTimeout(() => npcMove$.emit('first move of game'), 1000)
            return () => clearTimeout(t)
        }
        return () => { }
    }, [battleHasBegun])


    const isMoveAvailable = checkMoveAvailable(allCharacters)
    useEffect(() => {
        if (isMoveAvailable) return
        if (!battleHasBegun) return
        if (DEBUG) tl('resetting moves')
        dispatch({ a: 'clearHasMoved' })
        dispatch({ a: 'setIsPlayerTurn', v: isPlayerFirstTurn })
        tl(isPlayerTurn ? 'You start' : 'Enemy starts')
        if (!isPlayerFirstTurn) {
            npcMove$.emit('first move of round')
        }
    }, [isMoveAvailable])

    npcMove$.useSubscription(useCallback(function npcMove(reason: string): void {
        tl(`npcMove(reason: ${reason})`)
        if (alivePcs.length === 0) {
            // all PCs dead
            tl('all PC dead')
            return
        }
        if (!aliveNpcs.some(c => !c.hasMoved)) {
            console.warn('xKK9M')
            // TODO: this should never occur
            // no NPCs with moves, give the turn back
            dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        move$.emit(getNpcMove(allCharacters))
        if (alivePcs.some(c => !c.hasMoved)) {
            // tl('found unmoved PC, setting turn to true')
            // dispatch({ a: 'setIsPlayerTurn', v: true })
            setTimeout(() => dispatch({ a: 'setIsPlayerTurn', v: true }), 500)
        }
        else if (allCharacters.some(c => !c.isPc && c.health > 0 && !c.hasMoved)) {
            // tl('no unmoved PC taking another NPC turn')
            setTimeout(() => npcMove$.emit('no unmoved PC and NPC turn'), 1000)
        }
    }, [aliveNpcs, alivePcs, allCharacters, move$, npcMove$]))

    const onClick = function doCharacterAction(clicked: CharacterMeta) {
        if (checkWinner(allCharacters) != null) return
        if (!isPlayerTurn) {
            // tl('not your turn')
            return
        }

        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) {
                // tl('moved already')
                return
            }
            // tl('changing PC')
            dispatch({ a: 'setSelectedCharacter', c: clicked })
            return
        }

        // clicked on NPC but no selected character
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            // should be unreachable
            // tl('oops')
            return
        }
        if (state.selectedMove == null) {
            console.error('no selected move')
        } else {
            // tl('sending attack')
            const defenders = [clicked]
            if (moveTypeMetaMap[state.selectedMove.type].numTargets > 1) {
                const closest = getClosestAlive(allCharacters, clicked, 1)
                if (closest != null)
                    defenders.push(closest)
            }
            move$.emit({
                attacker: selectedCharacter,
                defenders: defenders, // TODO: slash
                move: state.selectedMove,
            }) // TODO: right target?
        }

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            // TODO: this should never occur
            console.error('no unmoved PC')
            dispatch({ a: 'setIsPlayerTurn', v: false })
            // TODO: check if unmoved NPC
            setTimeout(() => npcMove$.emit('attack back'), TIME_AFTER_PLAYER_MOVE + 500)
            return
            // throw Error('no player characters')
        }
        dispatch({ a: 'setSelectedCharacter', c: newPc })

        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    }

    return <div>
        {
            !battleHasBegun &&
            <IdleScreenOverlay>
                <Start onClick={() => dispatch({ a: 'setBattleHasBegun' })} />
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
                onClick={() => props.dispatch({ a: 'setSelectedMove', m: m })}
                isSelected={props.selectedMove === m.type}
            >
                {m.name}
            </MoveButton>
        )}
    </MoveMenuDiv>
}

export type MoveEmitter = EventEmitter<AttackData>
export type NpcMoveEmitter = EventEmitter<string>

export type Action =
    | { a: 'setIsPlayerTurn', v: boolean }
    | { a: 'setBattleHasBegun' }
    | { a: 'setHasMoved', id: string, v: boolean }
    | { a: 'setHealth', id: string, h: Set<number> }
    | { a: 'clearHasMoved' }
    | { a: 'setSelectedCharacter', c: CharacterMeta }
    | { a: 'setSelectedMove', m: MoveMeta }


function reducer(state: ReturnType<typeof makeInitialState>, action: Action) {
    // tl(`reducer received action ${JSON.stringify(action)}`)
    return produce(state, draft => {
        switch (action.a) {
            case 'setIsPlayerTurn': {
                // tl(`setting player turn to ${action.v}`)
                draft.isPlayerTurn = action.v
                return
            } case 'setBattleHasBegun': {
                draft.battleHasBegun = true
                return
            } case 'setHasMoved': {
                const c = draft.allCharacters.find(c => c.id === action.id)
                if (c == null) { console.error(`couldn't find character with id ${action.id}`); return }
                c.hasMoved = true
                return
            } case 'setHealth': {
                const c = draft.allCharacters.find(c => c.id === action.id)
                if (c == null) { console.error(`couldn't find character with id ${action.id}`); return }
                if (typeof action.h === 'function') {
                    c.health = action.h(c.health)
                } else {
                    c.health = action.h
                }
                return
            } case 'clearHasMoved': {
                draft.allCharacters.forEach(c => c.hasMoved = false)
                return
            } case 'setSelectedCharacter': {
                draft.selectedCharacter = action.c
                return
            } case 'setSelectedMove': {
                draft.selectedMove = action.m
                return
            } default:
                throw new Error(`unknown action ${JSON.stringify(action)}`)
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

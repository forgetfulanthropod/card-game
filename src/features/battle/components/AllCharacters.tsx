import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Sprite, Stage } from '@inlet/react-pixi'

import { useEventEmitter, useSize } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useEffectWhen } from 'hooks'
import produce from 'immer'
import toast from 'react-hot-toast'
import { moveTypeMetaMap } from '../util/constants'
import { makeInitialPlayerCharacters } from '../util/factories'
import { checkMoveAvailable, checkWinner, getClosestAlive, getId, getNpcMove, getUnmovedPc } from '../util/misc'
import { Frogknight, Skeleton } from './Character'
import { IdleScreenOverlay, Lose, MoveButton, MoveMenuDiv, Reset, Start } from './Styles'
import PixiBackground from './PixiBackground'




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
    const [isPlayerFirstTurn] = useState(() => state.isPlayerTurn)
    const [showLose, setShowLose] = useState(false)
    const { allCharacters, battleHasBegun, isPlayerTurn, selectedCharacter } = state

    // useLog({ isPlayerFirstTurn })
    const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
    const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)

    move$.useSubscription(function showMove(ad) {
        DEBUG && tl(`${ad.attacker.id} attacks ${ad.defenders.map(d => d.id)} with ${ad.move.name}`)
        toast(ad.move.name, {
            style: {
                backgroundColor: ad.attacker.isPc ? 'green' : 'red',
                color: 'white'
            }
        })
        console.log(ad.move.name)
    })

    useEffectWhen(function startGame() {
        if (!battleHasBegun) return () => { }
        tl(isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!isPlayerTurn) {
            const t = setTimeout(() => npcMove$.emit('first move of game'), 1000)
            return () => clearTimeout(t)
        }
        return () => { }
    }, [battleHasBegun, isPlayerTurn, npcMove$], [battleHasBegun])

    const isMoveAvailable = checkMoveAvailable(allCharacters)
    useEffectWhen(function resetRound() {
        if (isMoveAvailable) return
        if (!battleHasBegun) return
        if (DEBUG) tl('resetting moves')
        dispatch({ a: 'clearHasMoved' })
        dispatch({ a: 'setIsPlayerTurn', v: isPlayerFirstTurn })
        tl(isPlayerFirstTurn ? 'You start' : 'Enemy starts')
        if (!isPlayerFirstTurn) {
            setTimeout(() => npcMove$.emit('first move of round'), 500)
        }
    }, [battleHasBegun, isMoveAvailable, isPlayerFirstTurn, npcMove$], [isMoveAvailable])

    const winner = checkWinner(allCharacters)
    useEffect(function endGame() {
        console.log(winner === 'PC' ? 'You win' : 'Computer wins')
        if (winner === 'NPC') {
            const st = setTimeout(() => setShowLose(true), 1000)
            return () => clearTimeout(st)
        }
        if (winner === 'PC') {
            toast('YOU WIN')
        }
        return () => { }
    }, [winner])

    npcMove$.useSubscription(function doNpcMove(_reason) {
        // tl(`npcMove(reason: ${reason})`)
        if (checkWinner(allCharacters) != null) { return }
        if (isPlayerTurn) { return }
        if (alivePcs.length === 0) { return }
        if (aliveNpcs.every(c => c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        move$.emit(getNpcMove(allCharacters))
        if (alivePcs.some(c => !c.hasMoved)) {
            setTimeout(() => dispatch({ a: 'setIsPlayerTurn', v: true }), 500)
            return
        }
        if (aliveNpcs.some(c => !c.hasMoved)) {
            setTimeout(() => npcMove$.emit('no unmoved PC and NPC turn'), 1000)
        }
    })

    const onClick = function doCharacterAction(clicked: CharacterMeta) {
        if (checkWinner(allCharacters) != null) return
        if (!isPlayerTurn) return
        if (alivePcs.every(c => c.hasMoved)) return
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) return
            dispatch({ a: 'setSelectedCharacter', c: clicked })
            return
        }

        // clicked on NPC but no selected character
        if (!selectedCharacter || selectedCharacter.hasMoved) {
            // should be unreachable
            tl('select attacker first')
            return
        }
        if (state.selectedMove == null) {
            // should be unreachable
            tl('select move first')
            return
        }
        const defenders = [clicked]
        if (moveTypeMetaMap[state.selectedMove.type].numTargets > 1) {
            const closest = getClosestAlive(allCharacters, clicked, 1)
            if (closest != null) defenders.push(closest)
        }
        move$.emit({
            attacker: selectedCharacter,
            defenders: defenders,
            move: state.selectedMove,
        })

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(allCharacters)
        if (newPc == null) {
            // should be unreachable
            tl('no unmoved PC')
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('attack back'), TIME_AFTER_PLAYER_MOVE + 500)
            return
        }
        dispatch({ a: 'setSelectedCharacter', c: newPc })

        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    }

    const ref = useRef(null)
    const { width, height } = useSize(ref)
    console.log({ width, height })

    return <div ref={ref} style={{ width: '100%', height: '100%' }}>
        {
            !battleHasBegun &&
            <IdleScreenOverlay>
                <Start onClick={() => dispatch({ a: 'setBattleHasBegun' })} />
            </IdleScreenOverlay>
        }
        {
            showLose && <LoseScreen reset={props.reset} />
        }
        {
            width != null && height != null &&
            <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
                <PixiBackground />
                {allCharacters.map(characterMeta => {
                    const { x, y } = characterMeta
                    const pxCharacterMeta = { ...characterMeta, x: x * width / 100, y: y * height / 100 }
                    const id = getId(x, y)
                    const characterProps = { move$, dispatch, characterMeta: pxCharacterMeta, onClick, key: id }

                    return characterMeta.isPc ?
                        <Frogknight {...characterProps} isSelected={selectedCharacter?.id === id} /> :
                        <Skeleton {...characterProps} />
                })}
            </Stage>
        }
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

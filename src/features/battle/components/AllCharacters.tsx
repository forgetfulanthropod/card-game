import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Sprite, Stage } from '@inlet/react-pixi'

import { useEventEmitter, useSize } from 'ahooks'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useEffectWhen } from 'hooks'
import produce from 'immer'
import toast from 'react-hot-toast'
import { BASE_WIDTH, moveTypeMetaMap } from '../util/constants'
import { makeInitialPlayerCharacters } from '../util/factories'
import { checkMoveAvailable, checkWinner, getClosestAlive, getId, getNpcMove, getUnmovedPc } from '../util/misc'
import { Frogknight, Skeleton } from './Character'
import { IdleScreenOverlay, Lose, MoveButton, MoveMenuDiv, Reset, Start } from './Styles'
import PixiBackground from './PixiBackground'
import { Action, Dispatcher, State } from './CharacterManager'

import losePng from '../assets/fainted.png'
import Chest from './Chest'



export const DEBUG = false
const TIME_AFTER_PLAYER_MOVE = 1000
export const X_AGGRESSIVE_THRESH = 11
export const X_NEUTRAL_THRESH = 9

export const tl = (x: string): void => { console.log(x); toast(x) }



export default function AllCharacters(props: { reset: () => void, state: State, dispatch: Dispatcher }): JSX.Element {
    const { state, dispatch } = props
    const move$: MoveEmitter = useEventEmitter()
    const npcMove$: NpcMoveEmitter = useEventEmitter()
    const [isPlayerFirstTurn] = useState(() => state.isPlayerTurn)
    const [endScreen, setEndScreen] = useState<null | 'lose' | 'win'>(null)
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
            const st = setTimeout(() => setEndScreen('lose'), 1000)
            return () => clearTimeout(st)
        }
        if (winner === 'PC') {
            const st = setTimeout(() => setEndScreen('win'), 0) // MARK
            return () => clearTimeout(st)
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
    const size = useSize(ref)
    const { width, height } = size
    console.log({ width, height })
    const scale = width != null ? width / BASE_WIDTH : 1.0

    return <div ref={ref} style={{ width: '100%', height: '100%' }}>
        {
            !battleHasBegun &&
            <IdleScreenOverlay>
                <Start onClick={() => dispatch({ a: 'setBattleHasBegun' })} />
            </IdleScreenOverlay>
        }
        {
            endScreen == null ? null :
                endScreen === 'lose' ? <LoseScreen reset={props.reset} /> :
                    <WinScreen reset={props.reset} size={size} />
        }
        {
            width != null && height != null &&
            <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
                <PixiBackground scale={scale} />
                {allCharacters.map(characterMeta => {
                    const { x, y } = characterMeta
                    const pxCharacterMeta = { ...characterMeta, x: x * width / 100, y: y * height / 100 }
                    const id = getId(x, y)
                    const characterProps = { scale, move$, dispatch, characterMeta: pxCharacterMeta, onClick, key: id }

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

function LoseScreen(props: { reset: () => void }): JSX.Element {
    return <IdleScreenOverlay>
        <Lose src={losePng} />
        <Reset onClick={props.reset}>Reset</Reset>
    </IdleScreenOverlay>
}

function WinScreen(props: { reset: () => void, size: SizeQ }): JSX.Element {
    return <Chest size={props.size} />
    // return <Stage
    //     // width={width}
    //     // height={height}
    //     style={{
    //         position: 'absolute',
    //         width: '100%',
    //         height: '100%'
    //     }}
    //     options={{ backgroundAlpha: 0 }}
    // >
    //     <Sprite image={ChestBodyPng} />
    //     <Sprite image={ChestLidPng} x={0} />
    // </Stage>
    // <Reset onClick={props.reset}>Reset</Reset>

}

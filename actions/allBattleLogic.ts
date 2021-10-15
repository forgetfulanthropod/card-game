// TODO: getBattleScene
import type { AttackData, BattleScene, BattleWinState, CharacterMeta } from '@shared/index'
import { EventEmitter } from 'eventemitter3'

import { getBattleScene } from '.'
import dispatch from './dispatch'
import type { FBCursor } from './FBCursor'
import { putUpDoors_ } from './functions'
import { moveModiferMap as moveModifiers } from './rulebook/battle'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from './rulebook/battle/misc'
// import toast from 'react-hot-toast'
// import type { MoveEmitter, NpcMoveEmitter } from '@/types'
import { vals } from './util'


const TIME_AFTER_PLAYER_MOVE = 1000
const DEBUG = false

const tl = (x: string) => console.log(x)

// TODO
// interface Bindings  {
//     startGame: any,
//     resetRound: any,
//     endGame: any,
//     doCharacterAction: any,
//     move$: any,
// }
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getBindings() {
    const scene = await getBattleScene('alice')

    // const { battleCursor: battleState, dispatch } = props
    const move$ = new EventEmitter<{ '': AttackData }>()
    const npcMove$ = new EventEmitter<{ '': string }>()

    const cursorToState = async (cursor: FBCursor<BattleScene>) => {
        const value = await cursor.get()
        const allCharacters = vals(value.allCharacters)
        const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
        const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)
        const isMoveAvailable = checkMoveAvailable(allCharacters)
        if (!isMoveAvailable) { resetRound() }
        return { ...value, alivePcs, aliveNpcs, isMoveAvailable }
    }

    const state = await cursorToState(scene)
    // scene.on('update', function () {
    //     Object.assign(state, sceneToState(scene))
    // })
    const isPlayerFirstTurn = await scene.select('isPlayerTurn').get()
    // debugger


    move$.on('', function showMove(ad: AttackData) {
        if (DEBUG) tl(`${ad.attacker.uid} attacks ${ad.defenders.map(d => d.uid)} with ${ad.move.name}`)
        // toast(ad.move.name, { style: { backgroundColor: ad.attacker.isPc ? 'green' : 'red', color: 'white' } } )
        console.log(ad.move.name)
    })

    function startGame() {
        tl(state.isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!state.isPlayerTurn) {
            const t = setTimeout(() => npcMove$.emit('', 'first move of game'), 1000)
            return () => clearTimeout(t)
        }
        return () => { }
    }

    function resetRound() {
        if (DEBUG) tl('resetting moves')
        dispatch({ a: 'clearHasMoved' })
        dispatch({ a: 'setIsPlayerTurn', v: isPlayerFirstTurn })
        tl(isPlayerFirstTurn ? 'You start' : 'Enemy starts')
        if (!isPlayerFirstTurn) {
            setTimeout(() => npcMove$.emit('', 'first move of round'), 1000)
        }
    }

    // const winner = checkWinner(vals(state.allCharacters))
    function endGame(s: BattleWinState) {
        tl(s === 'won' ? 'You win' : 'Computer wins')
        if (s === 'won') {
            putUpDoors_()
        }
        // if (winner === 'NPC') {
        //     // TODO
        //     const st = setTimeout(() => showEndScreen('lose'), 1000)
        //     return () => clearTimeout(st)
        // }
        // if (winner === 'PC') {
        //     const st = setTimeout(() => showEndScreen('win'), 0) // MARK
        //     return () => clearTimeout(st)
        // }
        return () => { }
    }
    const winStateCursor = scene.select('state')
    winStateCursor.on('update', async () => {
        const s = await winStateCursor.get()
        if (s === 'won' || s === 'lost') {
            endGame(s)
        }
    })


    function doNpcMove(_reason?: string) {
        // tl(`npcMove(reason: ${reason})`)
        if (checkWinner(vals(state.allCharacters)) != null) { return }
        if (state.isPlayerTurn) { return }
        if (state.alivePcs.length === 0) { return }
        if (state.aliveNpcs.every(c => c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        const move = getNpcMove(vals(state.allCharacters))
        move$.emit('', move)
        dispatch({ a: 'setHasMoved', uid: move.attacker.uid, v: true })
        if (state.alivePcs.some(c => !c.hasMoved)) {
            setTimeout(() => dispatch({ a: 'setIsPlayerTurn', v: true }), 500)
            return
        }
        if (state.aliveNpcs.some(c => !c.hasMoved)) {
            setTimeout(() => npcMove$.emit('', 'no unmoved PC and NPC turn'), 1000)
        }
    }
    // tl('adding listiner')
    npcMove$.on('', e => doNpcMove(e))

    function doCharacterAction(clicked: CharacterMeta) {
        if (checkWinner(vals(state.allCharacters)) != null) return
        if (!state.isPlayerTurn) return
        if (state.alivePcs.every(c => c.hasMoved)) return
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) return
            dispatch({ a: 'setSelectedCharacter', c: clicked })
            return
        }

        // clicked on NPC but no selected character
        if (!state.selectedCharacter || state.allCharacters[state.selectedCharacter].hasMoved) {
            // should be unreachable
            tl('select attacker first')
            return
        }
        if (state.selectedMove == null) {
            // should be unreachable
            tl('select move first')
            return
        }
        dispatch({ a: 'setHasMoved', uid: state.selectedCharacter, v: true })
        const defenders = [clicked]
        if (moveModifiers[state.selectedMove.types[0]].numTargets > 1) {
            const closest = getClosestAlive(vals(state.allCharacters), clicked, 1)
            if (closest != null) defenders.push(closest)
        }
        const ad: AttackData = {
            attacker: state.allCharacters[state.selectedCharacter],
            defenders: defenders,
            move: state.selectedMove,
        }
        move$.emit('', ad)

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(vals(state.allCharacters), state.selectedCharacter)
        if (newPc == null) {
            // should be unreachable
            tl('no unmoved PC')
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('', 'attack back'), TIME_AFTER_PLAYER_MOVE + 500)
            return
        }
        tl(`selecting character ${newPc.uid}`)
        dispatch({ a: 'setSelectedCharacter', c: newPc })

        // if there's another unmoved NPC then make it strike
        if (state.aliveNpcs.some(c => !c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => npcMove$.emit('', 'NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    }
    return {
        startGame,
        resetRound,
        doCharacterAction,
        move$,
    }
}

function showEndScreen(_kind: 'win' | 'lose') {
    // TODO
}

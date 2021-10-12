import { MyCursor } from '@/config/myBaobab'
import { moveModiferMap } from '@/data/battle/constants'
import dispatch from '@/data/battle/dispatch'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from '@/data/battle/misc'
import { getBattleScene } from '@/data/rootTree'
import { AttackData, BattleScene, CharacterMeta } from '@/data/types'
import { MoveEmitter, NpcMoveEmitter } from '@/types'
import { vals } from '@/util'
import { EventEmitter } from 'eventemitter3'
import toast from 'react-hot-toast'

export const tl = (x: string): void => { console.log(x); toast(x) }

const TIME_AFTER_PLAYER_MOVE = 1000
const DEBUG = false


// TODO
// interface Bindings  {
//     startGame: any,
//     resetRound: any,
//     endGame: any,
//     doCharacterAction: any,
//     move$: any,
// }
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getBindings() {
    const scene = getBattleScene()

    // const { battleCursor: battleState, dispatch } = props
    const move$: MoveEmitter = new EventEmitter()
    const npcMove$: NpcMoveEmitter = new EventEmitter()

    const cursorToState = (cursor: MyCursor<BattleScene>) => {
        const value = cursor.get()
        const allCharacters = vals(value.allCharacters)
        const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
        const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)
        const isMoveAvailable = checkMoveAvailable(allCharacters)
        if (!isMoveAvailable) { resetRound() }
        return { ...value, alivePcs, aliveNpcs, isMoveAvailable }
    }

    const state = cursorToState(scene)
    scene.on('update', function () {
        Object.assign(state, cursorToState(scene))
    })
    const isPlayerFirstTurn = scene.select('isPlayerTurn').get()
    // debugger


    move$.on('', function showMove(ad: AttackData) {
        if (DEBUG) tl(`${ad.attacker.uid} attacks ${ad.defenders.map(d => d.uid)} with ${ad.move.name}`)
        toast(ad.move.name,
            {
                style: {
                    backgroundColor: ad.attacker.isPc ? 'green' : 'red',
                    color: 'white'
                }
            }
        )
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

    const winner = checkWinner(state.allCharacters)
    function endGame() {
        console.log(winner === 'PC' ? 'You win' : 'Computer wins')
        if (winner === 'NPC') {
            // TODO
            const st = setTimeout(() => showEndScreen('lose'), 1000)
            return () => clearTimeout(st)
        }
        if (winner === 'PC') {
            const st = setTimeout(() => showEndScreen('win'), 0) // MARK
            return () => clearTimeout(st)
        }
        return () => { }
    }

    function doNpcMove(reason?: string) {
        // tl(`npcMove(reason: ${reason})`)
        if (checkWinner(state.allCharacters) != null) { return }
        if (state.isPlayerTurn) { return }
        if (state.alivePcs.length === 0) { return }
        if (state.aliveNpcs.every(c => c.hasMoved)) {
            dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        const move = getNpcMove(state.allCharacters)
        move$.emit('', move)
        dispatch({ a: 'setHasMoved', id: move.attacker.uid, v: true })
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
        if (checkWinner(state.allCharacters) != null) return
        if (!state.isPlayerTurn) return
        if (state.alivePcs.every(c => c.hasMoved)) return
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) return
            dispatch({ a: 'setSelectedCharacter', c: clicked })
            return
        }

        // clicked on NPC but no selected character
        if (!state.selectedCharacter || state.selectedCharacter.hasMoved) {
            // should be unreachable
            tl('select attacker first')
            return
        }
        if (state.selectedMove == null) {
            // should be unreachable
            tl('select move first')
            return
        }
        dispatch({ a: 'setHasMoved', id: state.selectedCharacter.uid, v: true })
        const defenders = [clicked]
        if (moveModiferMap[state?.selectedMove?.types?.[0]].numTargets > 1) {
            const closest = getClosestAlive(state.allCharacters, clicked, 1)
            if (closest != null) defenders.push(closest)
        }
        move$.emit('', {
            attacker: state.selectedCharacter,
            defenders: defenders,
            move: state.selectedMove,
        })

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(state.allCharacters, state.selectedCharacter.uid)
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
        endGame,
        doCharacterAction,
        move$,
    }
}

function showEndScreen(_kind: 'win' | 'lose') {
    // TODO
}

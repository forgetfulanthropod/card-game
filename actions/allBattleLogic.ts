// TODO: getBattleScene
import type { AttackData, BattleScene, BattleWinState, CharacterUid, Gamestate } from '@shared/index'
import type { NetworkEvent } from '@shared/networkEvents'
import memoize from 'lodash/memoize'

import dispatch from './dispatch'
import { putUpDoors } from './doors'
import type { FBCursor } from './FBCursor'
import { getBattleScene, getGameStateCursor } from './getters'
import { makeServerEventEmitter } from './makeServerEventEmitter'
import { moveModiferMap as moveModifiers } from './rulebook/battle'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from './rulebook/battle/misc'
// import toast from 'react-hot-toast'
// import type { MoveEmitter, NpcMoveEmitter } from '@/types'
import { vals } from './util'

const TIME_AFTER_PLAYER_MOVE = 1000
const DEBUG = false

const tl = (x: string) => console.log(x)

const config = { log: true }

function log(...args: unknown[]) { if (config.log) { console.log(args) } }

export const getBindings = memoize(async function getBindings() {
    // TODO: RIDDLED WITH FUCKING BUGS
    const scene = await getBattleScene('alice')

    // const { battleCursor: battleState, dispatch } = props
    // TODO: move$ won't work anymore.
    const eventsCursor: FBCursor<Gamestate, NetworkEvent<'move', AttackData>[]> = (await getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', AttackData>('move', eventsCursor)

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


    // move $.on('', function showMove(ad: AttackData) {
    //     if (DEBUG) tl(`${ad.attacker.uid} attacks ${ad.defenders.map(d => d.uid)} with ${ad.move.name}`)
    //     // toast(ad.move.name, { style: { backgroundColor: ad.attacker.isPc ? 'green' : 'red', color: 'white' } } )
    //     console.log(ad.move.name)
    // })

    async function startGame() {
        if (await scene.get('state') === 'in battle') {
            // already in game
            console.warn('already started game')
            return
        }
        scene.set('state', 'in battle')
        tl(state.isPlayerTurn ? 'You go first!' : 'Enemy goes first!')
        if (!state.isPlayerTurn) {
            setTimeout(() => doNpcMove('first move of game'), 1000)
        }
    }

    async function resetRound() {
        if (DEBUG) tl('resetting moves')
        await dispatch({ a: 'clearHasMoved' })
        await dispatch({ a: 'setIsPlayerTurn', v: isPlayerFirstTurn })
        tl(isPlayerFirstTurn ? 'You start' : 'Enemy starts')
        if (!isPlayerFirstTurn) {
            setTimeout(() => doNpcMove('first move of round'), 1000)
        }
    }

    // const winner = checkWinner(vals(state.allCharacters))
    function endGame(s: BattleWinState) {
        tl(s === 'won' ? 'You win' : 'Computer wins')
        if (s === 'won') {
            putUpDoors()
        }
        // if (winner === 'NPC') {
        //     // TODO
        //     const st = setTimeout(() => showEndScreen('lose'), 1000)
        // }
    }
    const winStateCursor = scene.select('state')
    winStateCursor.on('update', async () => {
        const s = await winStateCursor.get()
        if (s === 'won' || s === 'lost') {
            endGame(s)
        }
    })


    async function doNpcMove(_reason?: string) {
        // tl(`npcMove(reason: ${reason})`)
        const prefix = 'npc not moving cuz '
        if (checkWinner(vals(state.allCharacters)) != null) {
            log(prefix + 'battle is won')
            return
        }
        if (state.isPlayerTurn) {
            log(prefix + 'it is player turn')
            return
        }
        if (state.alivePcs.length === 0) {
            log(prefix + 'none are alive')
            return
        }
        if (state.aliveNpcs.every(c => c.hasMoved)) {
            await dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        const move = getNpcMove(vals(state.allCharacters))
        move$.emit(move)
        await dispatch({ a: 'setHasMoved', uid: move.attacker.uid, v: true })
        if (state.alivePcs.some(c => !c.hasMoved)) {
            setTimeout(async () => await dispatch({ a: 'setIsPlayerTurn', v: true }), 500)
            return
        }
        if (state.aliveNpcs.some(c => !c.hasMoved)) {
            setTimeout(() => doNpcMove('no unmoved PC and NPC turn'), 1000)
        }
    }

    async function doCharacterAction(clickedUid: CharacterUid) {
        log('received click for ' + clickedUid)
        const clicked = state.allCharacters[clickedUid]
        if (checkWinner(vals(state.allCharacters)) != null) {
            log('winner exists')
            return
        }
        if (!state.isPlayerTurn) {
            log('not player turn')
            return
        }
        if (state.alivePcs.every(c => c.hasMoved)) {
            log('no unmoved pcs')
            return
        }
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) {
                log('selected char has already attacked')
                return
            }
            await dispatch({ a: 'setSelectedCharacter', c: clicked })
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
        await dispatch({ a: 'setHasMoved', uid: state.selectedCharacter, v: true })
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
        move$.emit(ad)

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(vals(state.allCharacters), state.selectedCharacter)
        if (newPc == null) {
            // should be unreachable
            tl('no unmoved PC')
            await dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => doNpcMove('attack back'), TIME_AFTER_PLAYER_MOVE + 500)
            return
        }
        tl(`selecting character ${newPc.uid}`)
        await dispatch({ a: 'setSelectedCharacter', c: newPc })

        // if there's another unmoved NPC then make it strike
        if (state.aliveNpcs.some(c => !c.hasMoved)) {
            await dispatch({ a: 'setIsPlayerTurn', v: false })
            setTimeout(() => doNpcMove('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    }
    return {
        startGame,
        doCharacterAction,
    }
})

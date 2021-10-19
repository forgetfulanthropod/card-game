import type { AttackData, BattleScene, BattleWinState, CharacterUid, Gamestate, NetworkAttackData } from '@shared/index'
import type { NetworkEvent } from '@shared/networkEvents'
import memoize from 'lodash/memoize'

import { moveModiferMap as moveModifiers } from '../../rulebook/battle'
import type { FireCursor } from '../../util/FireCursor'
import { getBattleScene, getGameStateCursor } from '../../util/getters'
import { makeServerEventEmitter } from '../../util/makeServerEventEmitter'
import { vals } from '../../util/objectMethods'
import { getCharacterKeysAndDamages } from './attack'
import dispatch from './dispatch'
import { putUpDoors } from './doors'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from './misc'

const TIME_AFTER_PLAYER_MOVE = 1000
const DEBUG = false

const tl = (x: string) => console.log(x)

const config = { log: true }

function log(...args: unknown[]) { if (config.log) { console.log(args) } }

function warn(...args: unknown[]) { if (config.log) { console.warn(args) } }

export const getBindings = memoize(async function getBindings() {
    // TODO: RIDDLED WITH FUCKING BUGS
    const scene = await getBattleScene('alice')
    // const dungeonName = await (await getBattleScene('alice')).get('dungeonName')
    // const dungeonModifier = rulebook.dungeonLevels.find(dl => dl.name === dungeonName).modifier ?? 1
    // const { battleCursor: battleState, dispatch } = props
    // TODO: move$ won't work anymore.
    const eventsCursor: FireCursor<Gamestate, NetworkEvent<'move', NetworkAttackData>[]> = (await getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)

    const cursorToState = async (cursor: FireCursor<BattleScene>) => {
        const value = await cursor.get()
        const allCharacters = vals(value.allCharacters)
        const alivePcs = allCharacters.filter(c => c.isPc && c.health > 0)
        const aliveNpcs = allCharacters.filter(c => !c.isPc && c.health > 0)
        const isMoveAvailable = checkMoveAvailable(allCharacters)
        if (!isMoveAvailable) { resetRound() }
        return { ...value, alivePcs, aliveNpcs, isMoveAvailable }
    }

    let state = await cursorToState(scene)

    scene.on('update', async () => state = await cursorToState(scene))

    const isPlayerFirstTurn = await scene.select('isPlayerTurn').get()

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
        tl(`npcMove(reason: ${_reason})`)
        const prefix = 'npc. not moving cuz '
        if (checkWinner(vals(state.allCharacters)) != null) {
            warn(prefix + 'battle is won')
            return
        }
        if (state.isPlayerTurn) {
            warn(prefix + 'it is player turn')
            return
        }
        if (state.alivePcs.length === 0) {
            warn(prefix + 'none are alive')
            return
        }
        if (state.aliveNpcs.every(c => c.hasMoved)) {
            await dispatch({ a: 'setIsPlayerTurn', v: true })
            return
        }
        const move = getNpcMove(vals(state.allCharacters))

        // const damageMap = getCharacterKeysAndDamages(move, dungeonModifier)
        const damageMap = getCharacterKeysAndDamages(move)

        move$.emit({
            attackerIsPc: false,
            attacker: move.attacker.uid,
            defenders: move.defenders.map(d => d.uid),
            move: move.move,
            damageMap
        })
        await dispatch({ a: 'move', d: move })
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
            warn('winner exists')
            return
        }
        if (!state.isPlayerTurn) {
            warn('not player turn')
            return
        }
        if (state.alivePcs.every(c => c.hasMoved)) {
            warn('no unmoved pcs')
            return
        }
        // click to choose selected Pc:
        if (clicked.isPc) {
            if (clicked.hasMoved) {
                warn('selected char has already attacked')
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
        await dispatch({ a: 'move', d: ad })
        const damageMap = getCharacterKeysAndDamages(ad)
        move$.emit({
            attackerIsPc: false,
            attacker: ad.attacker.uid,
            defenders: ad.defenders.map(d => d.uid),
            move: ad.move,
            damageMap
        })

        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(vals(state.allCharacters), state.selectedCharacter)
        if (newPc == null) {
            // should be unreachable
            warn('no unmoved PC')
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

import type { AttackData, BattleWinState, CharacterUid, Gamestate, NetworkAttackData } from '@shared/index'
import type { NetworkEvent } from '@shared/networkEvents'

import { makeServerEventEmitter } from '@/util/makeServerEventEmitter'

import { moveModiferMap as moveModifiers } from '../../rulebook/battle'
import type { FireCursor } from '../../util/FireCursor'
import { getBattleScene, getGameStateCursor } from '../../util/getters'
import { keys, vals } from '../../util/objectMethods'
import { getCharacterKeysAndDamages } from './attack'
import { putUpDoors } from './doors'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from './misc'

const TIME_AFTER_PLAYER_MOVE = 100
const DEBUG = false

const tl = (x: string) => console.log(x)

const config = { log: true }

function log(...args: unknown[]) { if (config.log) { console.log(args) } }

function warn(...args: unknown[]) { if (config.log) { console.warn(args) } }

export async function startGame_(): Promise<void> {
    const scene = await getBattleScene('alice')
    if (await scene.get('state') === 'in battle') {
        // already in game
        console.warn('already started game')
        return
    }
    scene.set('state', 'in battle')
    const playerStartsGame = Math.random() < 0.5
    scene.set('isPlayerTurn', playerStartsGame)
    tl(playerStartsGame ? 'You go first!' : 'Enemy goes first!')
    if (!playerStartsGame) {
        setTimeout(() => doNpcMove('first move of game'), 100)
    }
}

async function resetRound() {
    if (DEBUG) tl('resetting moves')
    const scene = await getBattleScene('alice')
    const cursor = scene.select('allCharacters')
    for (const k of keys(await cursor.get())) {
        cursor.select(k).set('hasMoved', false)
    }

    const playerStartsRound = Math.random() < 0.5
    scene.set('isPlayerTurn', playerStartsRound)
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        setTimeout(() => doNpcMove('first move of round'), 100)
    }
}

// const winner = checkWinner(vals(allCharacters))
// TODO: call this. (when?)
function endGame(s: BattleWinState) {
    tl(s === 'won' ? 'You win' : 'Computer wins')
    if (s === 'won') {
        putUpDoors()
    }
}

async function doNpcMove(_reason?: string) {
    const scene = await getBattleScene('alice')
    tl(`npcMove(reason: ${_reason})`)
    const { allCharacters, isPlayerTurn } = await (await getBattleScene('alice')).get()
    const alivePcs = vals(allCharacters).filter(c => c.isPc && c.health > 0)
    const aliveNpcs = vals(allCharacters).filter(c => !c.isPc && c.health > 0)
    const eventsCursor: FireCursor<Gamestate, NetworkEvent<'move', NetworkAttackData>[]> = (await getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)
    const prefix = 'npc. not moving cuz '
    if (checkWinner(vals(allCharacters)) != null) {
        warn(prefix + 'battle is won')
        return
    }
    if (isPlayerTurn) {
        warn(prefix + 'it is player turn')
        return
    }
    if (alivePcs.length === 0) {
        warn(prefix + 'none are alive')
        return
    }
    if (aliveNpcs.every(c => c.hasMoved)) {
        scene.set('isPlayerTurn', true)
        return
    }
    const move = getNpcMove(vals(allCharacters))

    const damageMap = getCharacterKeysAndDamages(move)

    move$.emit({
        attackerIsPc: false,
        attacker: move.attacker.uid,
        defenders: move.defenders.map(d => d.uid),
        move: move.move,
        damageMap
    })
    await dispatchMove(move)
    scene.select('allCharacters').select(move.attacker.uid).set('hasMoved', true)
    if (alivePcs.some(c => !c.hasMoved)) {
        setTimeout(async () => await scene.set('isPlayerTurn', true), 50)
        return
    }
    if (aliveNpcs.some(c => !c.hasMoved)) {
        setTimeout(() => doNpcMove('no unmoved PC and NPC turn'), 100)
    }
}

export async function doCharacterAction_(clickedUid: CharacterUid): Promise<void> {
    const scene = await getBattleScene('alice')
    const { allCharacters, isPlayerTurn, selectedCharacter, selectedMove } = await (await getBattleScene('alice')).get()
    log('received click for ' + clickedUid)
    const clicked = allCharacters[clickedUid]
    const alivePcs = vals(allCharacters).filter(c => c.isPc && c.health > 0)
    const aliveNpcs = vals(allCharacters).filter(c => !c.isPc && c.health > 0)
    const eventsCursor: FireCursor<Gamestate, NetworkEvent<'move', NetworkAttackData>[]> = (await getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)
    if (checkWinner(vals(allCharacters)) != null) {
        warn('winner exists')
        return
    }
    if (!isPlayerTurn) {
        warn('not player turn')
        return
    }
    if (alivePcs.every(c => c.hasMoved)) {
        warn('no unmoved pcs')
        return
    }
    // click to choose selected Pc:
    if (clicked.isPc) {
        if (clicked.hasMoved) {
            warn('selected char has already attacked')
            return
        }
        scene.set('selectedCharacter', clicked.uid)
        return
    }

    // clicked on NPC but no selected character
    if (!selectedCharacter || allCharacters[selectedCharacter].hasMoved) {
        // should be unreachable
        tl('select attacker first')
        return
    }
    if (selectedMove == null) {
        // should be unreachable
        tl('select move first')
        return
    }
    scene.select('allCharacters').select(selectedCharacter).set('hasMoved', true)

    const defenders = [clicked]
    if (moveModifiers[selectedMove.types[0]].numTargets > 1) {
        const closest = getClosestAlive(vals(allCharacters), clicked, 1)
        if (closest != null) defenders.push(closest)
    }
    const ad: AttackData = {
        attacker: allCharacters[selectedCharacter],
        defenders: defenders,
        move: selectedMove,
    }
    dispatchMove(ad)
    const damageMap = getCharacterKeysAndDamages(ad)
    move$.emit({
        attackerIsPc: false,
        attacker: ad.attacker.uid,
        defenders: ad.defenders.map(d => d.uid),
        move: ad.move,
        damageMap
    })

    // change to unmoved PC if there is one
    const newPc = getUnmovedPc(vals(allCharacters), selectedCharacter)
    if (newPc == null) {
        // should be unreachable
        warn('no unmoved PC')
        scene.set('isPlayerTurn', false)
        setTimeout(() => doNpcMove('attack back'), TIME_AFTER_PLAYER_MOVE + 50)
        return
    }
    tl(`selecting character ${newPc.uid}`)
    scene.set('selectedCharacter', newPc.uid)

    // if there's another unmoved NPC then make it strike
    if (aliveNpcs.some(c => !c.hasMoved)) {
        scene.set('isPlayerTurn', false)
        setTimeout(() => doNpcMove('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 50)
    }
}


async function dispatchMove(attackData: AttackData) {
    const scene = await getBattleScene('alice')
    const allCharacters = await scene.select('allCharacters').get()

    await Promise.all(getCharacterKeysAndDamages(attackData).map(async ({ key, damage }) => {
        const newHealth = allCharacters[key].health - damage
        return await scene.select('allCharacters').select(key).set('health', newHealth)
    }))

    const winner = checkWinner(vals(await scene.get('allCharacters')))

    if (winner === 'PC') scene.set('state', 'won')
    if (winner === 'NPC') scene.set('state', 'lost')
    const isMoveAvailable = checkMoveAvailable(vals(allCharacters))
    if (!isMoveAvailable) { resetRound() }
}

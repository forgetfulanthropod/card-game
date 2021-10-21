import type { AttackData, BattleScene, CharacterMeta, CharacterUid, Gamestate, NetworkAttackData } from '@shared/index'
import type { NetworkEvent } from '@shared/networkEvents'
import { memoize } from 'lodash'

import { moveModiferMap as moveModifiers } from '../../rulebook/battle'
import type { FireCursor } from '../../util/FireCursor'
import type { BattleCursor } from '../../util/getters'
import { getBattleScene, getGameStateCursor } from '../../util/getters'
import { makeServerEventEmitter } from '../../util/makeServerEventEmitter'
import { keys, vals } from '../../util/objectMethods'
import { getCharacterKeysAndDamages } from './attack'
import { putUpDoors } from './doors'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from './misc'
import applyMove from './move'

const TIME_AFTER_PLAYER_MOVE = 1
const DEFAULT_WAIT = 1
const NOT_YOUR_TURN_REJECTION_WAIT = 1000
const DEBUG = false

const tl = (x: string) => console.log(x)

const config = { log: true }

function log(...args: unknown[]) { if (config.log) { console.log(args) } }

function warn(...args: unknown[]) { if (config.log) { console.warn(args) } }


export async function startGame_(): Promise<void> {
    const scene = await getBattleScene('alice')
    if (scene.getK('state') === 'in battle') {
        // already in game
        console.warn('already started game')
        return
    }
    scene.setK('state', 'in battle')
    resetRound(scene)
    await scene.flush()
}

export function resetRound(scene: BattleCursor): void {
    if (DEBUG) tl('resetting moves')
    const cursor = scene.select('allCharacters')
    keys(cursor.get())
        .map((k) => cursor.select(k).setK('hasMoved', false))

    const playerStartsRound = Math.random() < 0.5
    scene.setK('isPlayerTurn', playerStartsRound)
    scene.flush()
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        setTimeout(() => doNpcMove('first move of round'), DEFAULT_WAIT)
    }
}

async function doNpcMove(_reason?: string) {
    const scene = await getBattleScene('alice')
    tl(`npcMove(reason: ${_reason})`)
    const { allCharacters, isPlayerTurn } = scene.get()
    const { alivePcs, aliveNpcs } = getLivingChars(allCharacters)
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
        warn(prefix + 'every npc has moved')
        // await scene.setK('isPlayerTurn', true)
        return
    }
    const move = getNpcMove(vals(allCharacters))
    await handleMove(scene, allCharacters, move)
}


export async function doCharacterAction_(clickedUid: CharacterUid): Promise<void> {
    const scene = await getBattleScene('alice')
    const { allCharacters, isPlayerTurn, selectedCharacter, selectedMove } = scene.get()
    log('received click for ' + clickedUid)
    const clicked = allCharacters[clickedUid]
    const { alivePcs } = getLivingChars(allCharacters)
    if (checkWinner(vals(allCharacters)) != null) {
        warn('winner exists')
        return
    }
    if (!isPlayerTurn) {
        warn('not player turn')
        setTimeout(() => {
            if (!scene.select('isPlayerTurn').get())
                doNpcMove('NPC has extra turns')
        }, NOT_YOUR_TURN_REJECTION_WAIT)
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
        scene.setK('selectedCharacter', clicked.uid)
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

    const defenders = [clicked]
    const moveModifier = moveModifiers[selectedMove.types[0]]
    const numTargets = typeof moveModifier.numTargets === 'number' ?
        moveModifier.numTargets :
        moveModifier.numTargets[moveModifier.numTargets.length - 1]
    if (numTargets > 1) {
        for (let i = 1; i < numTargets; i++) {
            const closest = getClosestAlive(vals(allCharacters), clicked, i)
            if (closest != null) defenders.push(closest)
        }
    }
    const ad: AttackData = {
        attacker: allCharacters[selectedCharacter],
        defenders: defenders,
        move: selectedMove,
    }
    await handleMove(scene, allCharacters, ad)

    await scene.flush()
}


async function handleMove(scene: BattleCursor, allCharacters: BattleScene['allCharacters'], attackData: AttackData) {
    const move$ = await getMoveChannel()

    // Dispatch move to client to trigger animation

    const damageMap = getCharacterKeysAndDamages(attackData)
    move$.emit({
        attackerIsPc: attackData.attacker.isPc,
        attacker: attackData.attacker.uid,
        defenders: attackData.defenders.map(d => d.uid),
        move: attackData.move,
        damageMap
    })

    // Update health, effects, and hasMoved

    applyMove(scene, allCharacters, attackData)

    // Check battle over

    const { allCharacters: newAllCharacters, selectedCharacter } = scene.get()
    const winner = checkWinner(vals(newAllCharacters))

    if (winner === 'PC') {
        scene.setK('state', 'won')
        putUpDoors(scene)
        return
    } else if (winner === 'NPC') {
        scene.setK('state', 'lost')
        return
    }

    // Check reset round

    const isMoveAvailable = checkMoveAvailable(vals(newAllCharacters))

    if (!isMoveAvailable) {
        resetRound(scene)
        return
    }

    // DO NEXT TURN


    const { alivePcs, aliveNpcs } = getLivingChars(newAllCharacters)

    if (attackData.attacker.isPc) {
        // change to unmoved PC if there is one
        const newPc = getUnmovedPc(vals(allCharacters), selectedCharacter)
        if (newPc == null) {
            warn('no unmoved PC')
        } else {
            tl(`selecting character ${newPc.uid}`)
            scene.setK('selectedCharacter', newPc.uid) // no await necessary
        }
        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            console.log('will be NPC turn')
            scene.setK('isPlayerTurn', false)
            await scene.flush()
            setTimeout(() => doNpcMove('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            console.log('will be player turn')
            scene.setK('isPlayerTurn', true)
            return
        }
        if (aliveNpcs.some(c => !c.hasMoved)) {
            console.log('will be player turn')
            await scene.flush()
            setTimeout(() => {
                doNpcMove('no unmoved PC and NPC turn')
            }, DEFAULT_WAIT)
        }
    }
}


const getMoveChannel = memoize(async function getMoveChannel() {
    const eventsCursor: FireCursor<Gamestate, NetworkEvent<'move', NetworkAttackData>[]> = (await getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)
    return move$
})

function getLivingChars(allCharacters: Record<string, CharacterMeta>) {
    const alivePcs = vals(allCharacters).filter(c => c.isPc && c.health > 0)
    const aliveNpcs = vals(allCharacters).filter(c => !c.isPc && c.health > 0)
    return { alivePcs, aliveNpcs }
}

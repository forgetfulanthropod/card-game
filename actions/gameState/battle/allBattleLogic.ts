import type { AttackData, BattleScene, CharacterMeta, CharacterUid, Gamestate, NetworkAttackData } from '@shared/index'
import type { NetworkEvent } from '@shared/networkEvents'
import { memoize } from 'lodash'

import { moveModiferMap as moveModifiers } from '../../rulebook/battle'
import type { FireCursor } from '../../util/FireCursor'
import { getBattleScene, getGameStateCursor } from '../../util/getters'
import { makeServerEventEmitter } from '../../util/makeServerEventEmitter'
import { keys, vals } from '../../util/objectMethods'
import { getCharacterKeysAndDamages } from './attack'
import { putUpDoors } from './doors'
import { checkMoveAvailable, checkWinner, getClosestAlive, getNpcMove, getUnmovedPc } from './misc'

const TIME_AFTER_PLAYER_MOVE = 1000
const DEFAULT_WAIT = 1000
const DEBUG = false

const tl = (x: string) => console.log(x)

const config = { log: true }

function log(...args: unknown[]) { if (config.log) { console.log(args) } }

function warn(...args: unknown[]) { if (config.log) { console.warn(args) } }

type Scene = FireCursor<Gamestate, BattleScene>

export async function startGame_(): Promise<void> {
    const scene = await getBattleScene('alice')
    if (await scene.get('state') === 'in battle') {
        // already in game
        console.warn('already started game')
        return
    }
    await scene.set('state', 'in battle')
    resetRound(scene)
}

export async function resetRound(scene: Scene): Promise<void> {
    if (DEBUG) tl('resetting moves')
    const cursor = scene.select('allCharacters')
    await clearAllMoves(cursor)

    const playerStartsRound = Math.random() < 0.5
    await scene.set('isPlayerTurn', playerStartsRound)
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        setTimeout(() => doNpcMove('first move of round'), DEFAULT_WAIT)
    }
}

async function clearAllMoves(cursor: FireCursor<Gamestate, Record<string, CharacterMeta>>) {
    await Promise.all(
        keys(await cursor.get())
            .map(async (k) => await cursor.select(k).set('hasMoved', false)))
}

async function doNpcMove(_reason?: string) {
    const scene = await getBattleScene('alice')
    tl(`npcMove(reason: ${_reason})`)
    const { allCharacters, isPlayerTurn } = await scene.get()
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
        // await scene.set('isPlayerTurn', true)
        return
    }
    const move = getNpcMove(vals(allCharacters))
    await handleMove(scene, allCharacters, move)
}


export async function doCharacterAction_(clickedUid: CharacterUid): Promise<void> {
    const scene = await getBattleScene('alice')
    const { allCharacters, isPlayerTurn, selectedCharacter, selectedMove } = await scene.get()
    log('received click for ' + clickedUid)
    const clicked = allCharacters[clickedUid]
    const { alivePcs } = getLivingChars(allCharacters)
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
        await scene.set('selectedCharacter', clicked.uid)
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
    if (moveModifiers[selectedMove.types[0]].numTargets > 1) {
        const closest = getClosestAlive(vals(allCharacters), clicked, 1)
        if (closest != null) defenders.push(closest)
    }
    const ad: AttackData = {
        attacker: allCharacters[selectedCharacter],
        defenders: defenders,
        move: selectedMove,
    }
    await handleMove(scene, allCharacters, ad)

}


async function handleMove(scene: Scene, allCharacters: BattleScene['allCharacters'], attackData: AttackData) {
    const move$ = await getMoveChannel()

    const damageMap = getCharacterKeysAndDamages(attackData)
    move$.emit({
        attackerIsPc: attackData.attacker.isPc,
        attacker: attackData.attacker.uid,
        defenders: attackData.defenders.map(d => d.uid),
        move: attackData.move,
        damageMap
    })

    // Update health and hasMoved

    await scene.select('allCharacters').select(attackData.attacker.uid).set('hasMoved', true)

    await Promise.all(getCharacterKeysAndDamages(attackData).map(async ({ key, damage }) => {
        const newHealth = allCharacters[key].health - damage
        await scene.select('allCharacters').select(key).set('health', newHealth)
    }))

    // Check battle over

    const { allCharacters: newAllCharacters, selectedCharacter } = await scene.get()
    const winner = checkWinner(vals(newAllCharacters))

    if (winner != null) {
        clearAllMoves
    }
    if (winner === 'PC') {
        await scene.set('state', 'won')
        putUpDoors(scene)
        return
    } else if (winner === 'NPC') {
        await scene.set('state', 'lost')
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
            scene.set('selectedCharacter', newPc.uid) // no await necessary
        }
        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            await scene.set('isPlayerTurn', false)
            setTimeout(() => doNpcMove('NPC has extra turns'), TIME_AFTER_PLAYER_MOVE + 500)
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            await scene.set('isPlayerTurn', true)
            return
        }
        if (aliveNpcs.some(c => !c.hasMoved)) {
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

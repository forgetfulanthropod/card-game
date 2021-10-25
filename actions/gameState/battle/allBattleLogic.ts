import type { AttackData, BattleScene, CharacterMeta, CharacterUid, Gamestate, NetworkAttackData, NetworkEvent } from '@shared'
import { memoize } from 'lodash'

import type { BattleCursor, DataCursor } from '@/util'
import { getBattleScene, getGameStateCursor, keys, makeServerEventEmitter, onCallWrapper, sleep, vals } from '@/util'

import { getCharacterKeysAndDamages } from './attack'
import { putUpDoors } from './doors'
import { incrementXP } from './experiencePoints'
import { checkMoveAvailable, checkWinner, getDefenders, getNpcMove, getUnmovedPc } from './misc'
import applyMove from './move'
import { getTransformed, isSpecial } from './specialMoves'


const TIME_AFTER_PLAYER_MOVE = 1000
const DEFAULT_WAIT = 1000
const NOT_YOUR_TURN_REJECTION_WAIT = 1000
const DEBUG = false

const tl = (x: string) => console.log(x)

const config = { log: true }

function log(...args: unknown[]) { if (config.log) { console.log(args) } }

function warn(...args: unknown[]) { if (config.log) { console.warn(args) } }


export const startGame = onCallWrapper(async function startGame(): Promise<void> {
    const scene = getBattleScene('alice')
    if (scene.getK('state') === 'in battle') {
        // already in game
        console.warn('already started game')
        return
    }
    scene.setK('state', 'in battle')
    await resetRound(scene)
})

export async function resetRound(scene: BattleCursor): Promise<void> {
    if (DEBUG) tl('resetting moves')
    const cursor = scene.select('allCharacters')
    keys(cursor.get())
        .map((k) => cursor.select(k).setK('hasMoved', false))

    const playerStartsRound = Math.random() < 0.5
    scene.setK('isPlayerTurn', playerStartsRound)
    tl(playerStartsRound ? 'You start' : 'Enemy starts')
    if (!playerStartsRound) {
        await sleep(DEFAULT_WAIT)
        await doNpcMove('first move of round')
    }
    scene.commit()
}

async function doNpcMove(_reason?: string) {
    const scene = getBattleScene('alice')
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
        scene.setK('isPlayerTurn', true)
        scene.commit()
        return
    }
    const move = getNpcMove(vals(allCharacters))
    await handleMove(scene, allCharacters, move)
}


export async function doCharacterAction_(clickedUid: CharacterUid): Promise<void> {
    const scene = getBattleScene('alice')
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
        if (!scene.getK('isPlayerTurn')) {
            await sleep(NOT_YOUR_TURN_REJECTION_WAIT)
            // TODO: uncomment below?
            await doNpcMove('NPC has extra turns')
        }
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

    let move = selectedMove
    if (isSpecial(move)) move = getTransformed(move, selectedCharacter)

    const ad: AttackData = {
        attacker: allCharacters[selectedCharacter],
        defenders: getDefenders(clicked, move, vals(allCharacters)),
        move,
    }
    await handleMove(scene, allCharacters, ad)
}


async function handleMove(scene: BattleCursor, allCharacters: BattleScene['allCharacters'], attackData: AttackData) {
    const move$ = getMoveChannel()

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
        incrementXP(scene)
        putUpDoors(scene)
        return
    } else if (winner === 'NPC') {
        scene.setK('state', 'lost')
        scene.commit()
        return
    }

    // Check reset round

    const isMoveAvailable = checkMoveAvailable(vals(newAllCharacters))

    if (!isMoveAvailable) {
        await resetRound(scene)
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
            scene.setK('selectedCharacter', newPc.uid)
        }
        // if there's another unmoved NPC then make it strike
        if (aliveNpcs.some(c => !c.hasMoved)) {
            console.log('will be NPC turn')
            scene.setK('isPlayerTurn', false)
            await sleep(TIME_AFTER_PLAYER_MOVE + 500)
            await doNpcMove('NPC has extra turns')
        }
    } else {
        if (alivePcs.some(c => !c.hasMoved)) {
            console.log('will be player turn')
            scene.setK('isPlayerTurn', true)
        } else if (aliveNpcs.some(c => !c.hasMoved)) {
            console.log('will be player turn')
            await sleep(DEFAULT_WAIT)
            await doNpcMove('no unmoved PC and NPC turn')
        }
    }
    scene.commit()
}


const getMoveChannel = memoize(function getMoveChannel() {
    const eventsCursor: DataCursor<Gamestate, NetworkEvent<'move', NetworkAttackData>[]> = (getGameStateCursor('alice')).select('events')
    const move$ = makeServerEventEmitter<'move', NetworkAttackData>('move', eventsCursor)
    return move$
})

function getLivingChars(allCharacters: Record<string, CharacterMeta>) {
    const alivePcs = vals(allCharacters).filter(c => c.isPc && c.health > 0)
    const aliveNpcs = vals(allCharacters).filter(c => !c.isPc && c.health > 0)
    return { alivePcs, aliveNpcs }
}

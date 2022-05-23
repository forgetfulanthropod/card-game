import { objFilter } from 'shared/code'
import type { BattleCursor } from 'shared'
import type { GameActions } from './types'
import { resetRound } from './internal'
import { getBattleSceneIn } from '@/util'
import {
    clearAllEffects,
    getNpcMoves,
    putAllCardsInDrawPile,
} from '@/gameState'
import { getRulebook } from '@/rulebook'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import {
    newNPCMeta,
    rearrangeNpcs,
} from '@/gameState/battle/characterManagement'

export const nextRoom: GameActions['NextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('roomsPassed', scene.get('roomsPassed') + 1)
    const nextRoom = getNextRoom(scene)
    let newNpcs = Object.fromEntries(
        nextRoom.map(({ name, level }) => {
            const uid = srandom().toString().slice(6)
            return [
                uid,
                newNPCMeta({
                    name,
                    level,
                    uid: uid,
                    x: 0,
                    y: 0,
                }),
            ]
        })
    )
    newNpcs = rearrangeNpcs(newNpcs)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...newNpcs,
    }))
    scene.set('state', 'in battle')
    scene.set('nextEnemyCards', getNpcMoves(scene))
    clearAllEffects(scene)
    scene.set('turnCount', 1)
    putAllCardsInDrawPile(scene)
    resetRound(args.game, {})
}
function getNextRoom(scene: BattleCursor) {
    const dungeonName = scene.get('dungeonName')
    const roomsPassed = scene.get('roomsPassed')
    const roomsHere = getRulebook().dungeonRooms[dungeonName]
    return roomsHere[roomsPassed + 1] ?? roomsHere[0]
}

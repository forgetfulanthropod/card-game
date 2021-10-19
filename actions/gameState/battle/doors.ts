import type { CharacterMeta, CharacterUid, Door, DungeonName } from '@shared/index'

import { dungeonRooms } from '../../rulebook/dungeonRooms'
import { mapToObj } from '../../rulebook/objUtils'
import { getBattleScene } from '../../util/getters'
import { length } from '../../util/objectMethods'
import { weightedRandom } from './misc'
import { newNPCMeta } from './state'

// type CharacterModifer = string

type Room = {
    modifier: number
    enemies: Record<CharacterUid, CharacterMeta>
}

export function getDoorChoices(args: { roomsPassed: number, dungeonName: DungeonName }): Door[] {
    const allDoors: Door[] = ['A', 'B', 'C', 'D']
    const n = length(dungeonRooms[args.roomsPassed + 1])
    return allDoors.slice(0, n)
}

export function makeRoom(args: { door: Door, dungeonName: string, roomsPassed: number }): Room {
    const roomOutcomes = dungeonRooms[args.roomsPassed + 1][args.door]
    if (roomOutcomes == null) {
        throw Error(`Could not find roomOutcomes at dungeonRooms[${args.roomsPassed + 1}][${args.door}]`)
    }
    const index = weightedRandom(roomOutcomes.probs)
    const outcome = roomOutcomes.outcomes[index]
    return {
        modifier: -1,
        enemies: mapToObj(outcome, pair => {
            const [name, _level] = pair
            const uid = makeUid()
            return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid })]
        })
    }
}

function makeUid(): string {
    return 'charUid-fromDoors-' + Math.random().toString().slice(2, 6)
}

function randInt(min: number, under: number): number {
    return (Math.random() * (under - min) + min) | 0
}

export async function putUpDoors(): Promise<void> {
    const scene = await getBattleScene('alice')
    // console.log('adding doors')
    const { roomsPassed, dungeonName } = await scene.get()
    scene.set('state', 'not started')
    scene.set('doors', getDoorChoices({ roomsPassed, dungeonName }))
}

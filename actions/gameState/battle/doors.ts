import type { CharacterMeta, CharacterUid, Door, DungeonName } from '@shared/index'
import { sampleSize } from 'lodash'

import { npcNames } from '../../rulebook/battle'
import { dungeonRooms } from '../../rulebook/dungeonRooms'
import { mapToObj, zip } from '../../util/arrayMethods'
import { getBattleScene } from '../../util/getters'
import { valMap } from '../../util/objectMethods'
import { length } from '../../util/objectMethods'
import { weightedRandom } from './misc'
import { newNPCMeta } from './state'


// type CharacterModifer = string


const config = {
    addRandomDoor: true
}


type Room = {
    modifier: number
    enemies: Record<CharacterUid, CharacterMeta>
}

export function getDoorChoices(args: { roomsPassed: number, dungeonName: DungeonName }): { options: Door[], descriptions: string[] } {
    const allDoors: Door[] = ['A', 'B', 'C', 'D']
    const roomOutcomes = dungeonRooms[args.roomsPassed + 1]
    const options = allDoors.slice(0, length(roomOutcomes))
    const descriptions = valMap(roomOutcomes, outcome =>
        zip(outcome.outcomes, outcome.probs)
            .map(([o, p]) =>
                o.map(([name, level]) =>
                    `Lvl${level} ${name}`).join(' + ')
                + ' : '
                + p.toString().slice(0, 3))
            .join('\n'))
    if (config.addRandomDoor) {
        options.push('random')
        descriptions.push('completely random')
    }
    return { options, descriptions }
}

export function makeRoom(args: { door: Door, dungeonName: string, roomsPassed: number }): Room {
    if (args.door === 'random') {
        return {
            modifier: -1,
            enemies: mapToObj(sampleSize(npcNames, randInt(0, 5)), name => {
                const uid = makeUid()
                return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid, level: 1 })]
            })
        }
    }
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
            return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid, level: _level })]
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

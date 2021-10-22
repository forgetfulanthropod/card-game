import type { BattleScene, CharacterMeta, CharacterUid, Door, DungeonName, Gamestate } from '@shared/index'
import { sampleSize } from 'lodash'

import { npcNames } from '../../rulebook/battle'
import { dungeonRooms } from '../../rulebook/dungeonRooms'
import type { SpecialDoor } from '../../rulebook/battle/specialDoorsMap'
import { mapToObj, zip } from '../../util/arrayMethods'
import type { DataCursor } from '../../util/DataCursor'
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
            enemies: mapToObj(sampleSize(npcNames, randInt(1, 5)), name => {
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
            const [name, level] = pair
            const uid = makeUid()
            return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid, level })]
        })
    }
}

export function handleSpecialDoor(args: { door: SpecialDoor }) {
    const d = args.door
    switch (d.name) {
        case 'bigScary': {
            break
        }
        case 'candyBaby': {
            break
        }
        case 'normal': {
            break
        }
        case 'matcha': {
            break
        }
        case 'skeleton': {
            break
        }
        case 'rareItem': {
            break
        }
        case 'bossDoor': {
            break
        }
        case 'face': {
            break
        }
        case 'tiny': {
            break
        }
        case 'jumbo': {
            break
        }
        case 'randomEvent': {
            break
        }
        case 'campfire': {
            break
        }
        default: {
            throw Error(`unknown door type `)
        }
    }
}


export function putUpDoors(scene: DataCursor<Gamestate, BattleScene>): void {
    // console.log('adding doors')
    const { roomsPassed, dungeonName } = scene.get()
    scene.setK('state', 'not started')
    scene.setK('doors', getDoorChoices({ roomsPassed, dungeonName }))
    scene.flush()
}


function makeUid(): string {
    return 'charUid-fromDoors-' + Math.random().toString().slice(2, 6)
}

function randInt(min: number, under: number): number {
    return (Math.random() * (under - min) + min) | 0
}

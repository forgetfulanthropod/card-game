import type { BattleScene, CharacterMeta, CharacterUid, Door, DungeonName, Gamestate } from '@shared/index'
import { keys, sample, sampleSize } from 'lodash'

import { npcNames } from '../../rulebook/battle'
import type { SpecialDoorName } from '../../rulebook/battle/specialDoorsMap'
import { specialDoorsMap } from '../../rulebook/battle/specialDoorsMap'
import { dungeonRooms } from '../../rulebook/dungeonRooms'
import { mapToObj } from '../../util/arrayMethods'
import type { DataCursor } from '../../util/DataCursor'
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

export function getDoorChoices(args: { roomsPassed: number, dungeonName: DungeonName }): { options: SpecialDoorName[], descriptions: string[] } {

    return {
        options: ['bigScary', 'normal', 'matcha'],
        descriptions: ['big scary door', 'random choice of A,B,C...', 'matcha door']
    }
    // const allDoors: Door[] = ['A', 'B', 'C', 'D']
    // const roomOutcomes = dungeonRooms[args.roomsPassed + 1]
    // const options = allDoors.slice(0, length(roomOutcomes))
    // const descriptions = valMap(roomOutcomes, outcome =>
    //     zip(outcome.outcomes, outcome.probs)
    //         .map(([o, p]) =>
    //             o.map(([name, level]) =>
    //                 `Lvl${level} ${name}`).join(' + ')
    //             + ' : '
    //             + p.toString().slice(0, 3))
    //         .join('\n'))
    // if (config.addRandomDoor) {
    //     options.push('random')
    //     descriptions.push('completely random')
    // }
    // return { options, descriptions }
}

export function makeRoom(args: { door: Door, dungeonName: string, roomsPassed: number, modifier?: number }): Room {
    const modifier = args?.modifier ?? 1
    if (args.door === 'random') {
        return {
            modifier,
            enemies: mapToObj(sampleSize(npcNames, randInt(1, 5)), name => {
                const uid = makeUid()
                return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid, level: randInt(1, 4) })]
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
        modifier,
        enemies: mapToObj(outcome, pair => {
            const [name, level] = pair
            const uid = makeUid()
            return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid, level: level * modifier })]
        })
    }
}

export function handleSpecialDoor(args: {
    door: SpecialDoorName,
    dungeonName: DungeonName,
    roomsPassed: number
}): Room {

    const { door, dungeonName, roomsPassed } = args
    // Putting the assignment inside each case makes typescript happy
    switch (door) {
        case 'bigScary': {
            const d = specialDoorsMap[door]
            const regularDoorOptions = keys(dungeonRooms[args.roomsPassed + 1])
            if (regularDoorOptions.length === 0) {
                console.error('no door options!')
                return { modifier: -1, enemies: {} }
            }
            const regularDoorName = sample(regularDoorOptions) as Door
            return makeRoom({ dungeonName, roomsPassed, door: regularDoorName, modifier: d.variables.modifier })
        }
        case 'candyBaby': {
            const _d = specialDoorsMap[door]
            throw Error(`unimplented door: ${door}`)
        }
        case 'normal': {
            return makeRandRegularRoom(dungeonName, roomsPassed)
        }
        case 'matcha': case 'skeleton': {
            const v = specialDoorsMap[door].variables
            const uid = makeUid()
            // if (roomsPassed + 1 === v.levelToAppearOn) {
            return {
                modifier: 1,
                enemies: { [uid]: newNPCMeta({ ...randCoords(), name: v.enemyName, uid, level: v.enemyLevel }) }
            }
            // }
            // return makeRandRegularRoom(dungeonName, roomsPassed)
        }
        case 'rareItem': {
            const _v = specialDoorsMap[door].variables
            throw Error(`unimplented door: ${door}`)
        }
        case 'bossDoor': {
            const _v = specialDoorsMap[door].variables
            throw Error(`unimplented door: ${door}`)
        }
        case 'face': {
            const _v = specialDoorsMap[door].variables
            throw Error(`unimplented door: ${door}`)
        }
        case 'tiny': {
            const _v = specialDoorsMap[door].variables
            throw Error(`unimplented door: ${door}`)
        }
        case 'jumbo': {
            const _v = specialDoorsMap[door].variables
            throw Error(`unimplented door: ${door}`)
        }
        case 'randomEvent': {
            const _v = specialDoorsMap[door].variables
            throw Error(`unimplented door: ${door}`)
        }
        case 'campfire': {
            const v = specialDoorsMap[door].variables
            if (v.effectType === 'absolute') {
                console.error('unimplemented')
                return { modifier: -1, enemies: {} }
            } else if (v.effectType === 'proportional') {
                console.error('unimplemented')
                return { modifier: -1, enemies: {} }
            } else {
                throw Error(`campfire has unknown effectType ${v.effectType}`)
            }
        }
        default: {
            throw Error('unknown door type ')
        }
    }
}

function makeRandRegularRoom(dungeonName: DungeonName, roomsPassed: number): Room {
    const regularDoorOptions = keys(dungeonRooms[roomsPassed + 1])
    if (regularDoorOptions.length === 0) {
        console.error('no door options!')
        return { modifier: -1, enemies: {} }
    }
    const regularDoorName = sample(regularDoorOptions) as Door
    return makeRoom({ dungeonName, roomsPassed, door: regularDoorName })
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

function randCoords() {
    return { x: randInt(50, 95), y: randInt(40, 80) }
}

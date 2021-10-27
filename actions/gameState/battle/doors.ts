import type { BattleScene, CharacterMeta, CharacterUid, Door, DungeonName, Gamestate } from '@shared'
import { keys, sample, sampleSize, zip } from 'lodash'

import type { SpecialDoorName } from '@/rulebook/battle'
import { npcNames, specialDoorsMap } from '@/rulebook/battle'
import type { RoomOutcomes } from '@/rulebook/dungeonRooms'
import { dungeonRooms } from '@/rulebook/dungeonRooms'
import type { DataCursor } from '@/util'
import { vals } from '@/util'
import { mapToObj } from '@/util'

import { weightedRandom } from './misc'
import { newNPCMeta } from './state'


// type CharacterModifer = string


// const config = { addRandomDoor: true }


type Room = {
    modifier: number
    enemies: Record<CharacterUid, CharacterMeta>
}

export function getDoorChoices(args: { roomsPassed: number, dungeonName: DungeonName }): { options: SpecialDoorName[], descriptions: string[] } {

    const options: SpecialDoorName[] = ['bigScary', 'normal', 'matcha']
    const roomOutcomes = dungeonRooms[args.roomsPassed + 1]
    const descriptions = describeOutcomes(roomOutcomes).join('\n or \n')
    return {
        options,
        descriptions: ['big scary door\n X2 Modifier', descriptions, 'LV 10 matcha door'],
    }
    // const allDoors: Door[] = ['A', 'B', 'C', 'D']
    // const options = allDoors.slice(0, length(roomOutcomes))
    // if (config.addRandomDoor) {
    //     options.push('random')
    //     descriptions.push('completely random')
    // }
    // return { options, descriptions }
}

function describeOutcomes(roomOutcomes: Record<string, RoomOutcomes>): string[] {
    return vals(roomOutcomes).map(outcome => zip(outcome.outcomes, outcome.probs)
        .map(([o, p]) => o != null && p != null && o.map(([name, level]) => `Lvl${level} ${name}`).join(' + ')
            + ' : '
            + p.toString().slice(0, 3))
        .join('\n'))
}

function makeRoom(args: { door: Door, dungeonName: string, roomsPassed: number, modifier?: number }): Room {
    const modifier = args?.modifier ?? 1
    if (args.door === 'random') {
        return {
            modifier,
            enemies: mapToObj(sampleSize(npcNames, randInt(1, 5)), name => {
                const uid = makeUid()
                return [uid, newNPCMeta({ x: randInt(50, 80), y: randInt(40, 70), name, uid, level: randInt(1, 4) })]
            }),
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
        }),
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
                logger.error('no door options!')
                return { modifier: -1, enemies: {} }
            }
            const regularDoorName = sample(regularDoorOptions) as Door
            return makeRoom({ dungeonName, roomsPassed, door: regularDoorName, modifier: d.variables.modifier })
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
                enemies: { [uid]: newNPCMeta({ ...randCoords(), name: v.enemyName, uid, level: v.enemyLevel }) },
            }
            // }
            // return makeRandRegularRoom(dungeonName, roomsPassed)
        }
        case 'campfire': {
            const v = specialDoorsMap[door].variables
            if (v.effectType === 'absolute') {
                logger.error('unimplemented')
                return { modifier: -1, enemies: {} }
            } else if (v.effectType === 'proportional') {
                logger.error('unimplemented')
                return { modifier: -1, enemies: {} }
            } else {
                throw Error(`campfire has unknown effectType ${v.effectType}`)
            }
        }
        default: {
            // TODO: 'rareItem' 'bossDoor' 'face' 'tiny' 'jumbo' 'randomEvent' 'candyBaby'
            throw Error('unknown door type ')
        }
    }
}

function makeRandRegularRoom(dungeonName: DungeonName, roomsPassed: number): Room {
    const regularDoorOptions = keys(dungeonRooms[roomsPassed + 1])
    if (regularDoorOptions.length === 0) {
        logger.error('no door options!')
        return { modifier: -1, enemies: {} }
    }
    const regularDoorName = sample(regularDoorOptions) as Door
    return makeRoom({ dungeonName, roomsPassed, door: regularDoorName })
}

export function putUpDoors(scene: DataCursor<Gamestate, BattleScene>): void {
    // logger.info('adding doors')
    const { roomsPassed, dungeonName } = scene.get()
    scene.setK('state', 'not started')
    scene.setK('doors', getDoorChoices({ roomsPassed, dungeonName }))
    scene.commit()
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

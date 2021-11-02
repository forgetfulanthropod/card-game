import type { BattleScene, CharacterMeta, CharacterUid, Door, DungeonName, WorldEvent, WorldEventData } from '@shared'
import type { SpecialDoorName } from '@shared'
import type { RoomOutcomes } from '@shared'
import type { SCursor } from 'baobab'
import { keys, memoize, zip } from 'lodash'

import { getRulebook } from '@/rulebook'
import { commit, getGameStateCursor, makeServerEventEmitter, mapToObj, srandInt, ssample, ssampleSize, vals } from '@/util'

import { weightedRandom } from './misc'
import { newNPCMeta } from './state'


const { characters, specialDoorsMap, dungeonRooms, eventTriggersMap } = getRulebook()
const npcNames = Object.values(characters).filter(x => !x.isPc).map(x => x.name)
// type CharacterModifer = string


// const config = { addRandomDoor: true }


type Room = {
    modifier: number
    enemies: Record<CharacterUid, CharacterMeta>
}

export function getDoorChoices(args: { roomsPassed: number, dungeonName: DungeonName }): { options: SpecialDoorName[], descriptions: string[] } {

    const options: SpecialDoorName[] = ['bigScary', 'normal', 'matcha', 'randomEvent']
    const roomOutcomes = dungeonRooms[args.roomsPassed + 1]
    const normalDescriptions = describeOutcomes(roomOutcomes).join('\n or \n')
    return {
        options,
        descriptions: [
            'big scary door\n X2 Modifier',
            normalDescriptions,
            'LV 10 matcha door',
            'randomEvent',
        ],
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
            enemies: mapToObj(ssampleSize(npcNames, srandInt(1, 5)), name => {
                const uid = makeUid()
                return [uid, newNPCMeta({ x: srandInt(50, 80), y: srandInt(40, 70), name, uid, level: srandInt(1, 4) })]
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
            return [uid, newNPCMeta({ x: srandInt(50, 80), y: srandInt(40, 70), name, uid, level: level * modifier })]
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
            const regularDoorName = ssample(regularDoorOptions) as Door
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
        case 'randomEvent': {
            const worldEvent = ssample(vals(eventTriggersMap))
            getWorldChannel().emit({ title: worldEvent.shortDescription, body: worldEvent.fullDescription })
            return makeRandRegularRoom(dungeonName, roomsPassed)
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
    const regularDoorName = ssample(regularDoorOptions) as Door
    return makeRoom({ dungeonName, roomsPassed, door: regularDoorName })
}

export function putUpDoors(scene: SCursor<BattleScene>): void {
    // logger.info('adding doors')
    const { roomsPassed, dungeonName } = scene.get()
    scene.set('state', 'not started')
    scene.set('doors', getDoorChoices({ roomsPassed, dungeonName }))
    commit(scene)
}


function makeUid(): string {
    return 'charUid-fromDoors-' + srandom().toString().slice(2, 6)
}


function randCoords() {
    return { x: srandInt(50, 95), y: srandInt(40, 80) }
}

const getWorldChannel = memoize(function getWorldChannel() {
    const eventsCursor: SCursor<WorldEvent[]> = (getGameStateCursor('alice')).select('events').select('world')
    const move$ = makeServerEventEmitter<'world', WorldEventData>('world', eventsCursor)
    return move$
})

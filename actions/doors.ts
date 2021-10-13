import { newNPCMeta } from '@@/db/battle/state'
import { CharacterMeta, CharacterName, CharacterUid } from '@@/db/datamodel'

export type Door = 'ordinary' | 'easier' | 'harder' | 'etc'

// type CharacterModifer = string

type Room = {
    modifier: number
    enemies: Record<CharacterUid, CharacterMeta>
}

export function getDoorChoices(args: { roomsPassed: number, dungeonName: string, otherInfoIdk?: any }): [Door, Door, Door] {
    return ['ordinary', 'easier', 'harder']
}

export function makeRoom(args: { door: Door, dungeonName: string, roomsPassed: number }): Room {
    const uids = new Array(10).fill(null).map(() => Math.random().toString().slice(2))
    switch (args.door) {
        case 'ordinary':
            return {
                modifier: 1,
                enemies: {
                    [uids[0]]: newNPCMeta({ x: 50, y: 50, uid: uids[0], name: 'skeletonWarrior' }),
                    [uids[1]]: newNPCMeta({ x: 60, y: 50, uid: uids[1], name: 'skeletonWarrior' }),
                    [uids[2]]: newNPCMeta({ x: 70, y: 50, uid: uids[2], name: 'skeletonWarrior' }),
                },
            }
        case 'easier':
            return {
                modifier: 1,
                enemies: {
                    [uids[0]]: newNPCMeta({ x: 50, y: 50, uid: uids[0], name: 'skeletonWarrior' }),
                },
            }
        case 'harder':
            return {
                modifier: 1,
                enemies: {
                    [uids[0]]: newNPCMeta({ x: 50, y: 50, uid: uids[0], name: 'orcWarrior' }),
                    [uids[1]]: newNPCMeta({ x: 60, y: 50, uid: uids[1], name: 'orcWarrior' }),
                    [uids[2]]: newNPCMeta({ x: 70, y: 50, uid: uids[2], name: 'mimic' }),
                },
            }
        default:
            throw Error(`unknown door type ${args.door}`)
    }
}

export default null

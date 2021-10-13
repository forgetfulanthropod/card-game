// @ts-nocheck
import { CharacterName } from '@@/db/datamodel'

type Door = 'ordinary' | 'easier' | 'harder' | 'etc'

type CharacterModifer = string

type Room = {
    modifier: number
    enemies: Record<CharacterName, CharacterModifer[]>
}

export function getDoorChoices(prevRoom: number, dungeonName: string, otherInfoIdk: any): [Door, Door, Door] {
    return ['ordinary', 'ordinary', 'ordinary']
}

export function makeRoom(door: Door, dungeonName: string): Room {
    switch (door) {
        case 'ordinary':
            return {
                modifier: 2,
                enemies: {},
            }
        case 'easier':
            return {
                modifier: 2,
                enemies: {},
            }
        default:
            throw Error()
    }
}

export default null

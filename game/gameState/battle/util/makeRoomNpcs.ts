import type { DungeonRoom, EnemyCharacterId } from 'shared'
import { newNPCMeta, rearrangeNpcs } from './characterManagement'

export function makeRoomNpcs(nextRoom: DungeonRoom) {
    if (nextRoom[0].id === 'REST_SITE') return {}

    let newNpcs = Object.fromEntries(
        nextRoom.map(({ id: name, level }) => {
            const uid = srandom().toString().slice(6)
            return [
                uid,
                newNPCMeta({
                    name: name as EnemyCharacterId,
                    level,
                    uid,
                    x: 0,
                    y: 0,
                }),
            ]
        })
    )
    newNpcs = rearrangeNpcs(newNpcs)
    return newNpcs
}

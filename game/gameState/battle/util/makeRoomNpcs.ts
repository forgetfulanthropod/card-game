import type { DungeonRoom } from 'shared'
import { newNPCMeta, rearrangeNpcs } from './characterManagement'

export function makeRoomNpcs(nextRoom: DungeonRoom) {
    let newNpcs = Object.fromEntries(
        nextRoom.map(({ id: name, level }) => {
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
    return newNpcs
}

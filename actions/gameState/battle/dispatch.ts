import type { Dispatch } from '@shared/actions'

import { getBattleScene } from '../../util/getters'
import { keys } from '../../util/objectMethods'
import { makeBattleState } from './state'


const dispatch: Dispatch = async (action) => {
    // console.log({ scene, action, data: scene.get() })
    // console.log(`>>>>dispatching ${JSON.stringify(action)}`)
    const scene = await getBattleScene('alice')
    switch (action.a) {
        case 'setSelectedMove': {
            scene.set('selectedMove', action.m)
            return
        } case 'fullReset': {
            scene.set(makeBattleState())
            return
        } case 'updateScreenSize': {
            const cursor = scene.select('allCharacters')
            for (const k of keys(await cursor.get())) {
                const cu = cursor.select(k)
                const ch = await cu.get()
                cu.set('screenX', ch.x * action.size.width / 100)
                cu.set('screenY', ch.y * action.size.height / 100)
            }
            return
        } case 'setIsBasicLoaded': {
            scene.set('isBasicLoaded', action.v)
            return
        } case 'setIsDeluxeLoaded': {
            scene.set('isDeluxeLoaded', action.v)
            return
        } default:
            throw new Error(`unknown action ${JSON.stringify(action)}`)
    }
}
export default dispatch

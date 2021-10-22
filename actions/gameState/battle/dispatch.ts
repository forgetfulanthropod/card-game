import type { Action } from '@shared/actions'

import { getBattleScene } from '../../util/treeAccessors'
import { keys } from '../../util/objectMethods'
import { makeBattleState } from './state'


const dispatch = (action: Action): void => {
    // console.log({ scene, action, data: scene.get() })
    // console.log(`>>>>dispatching ${JSON.stringify(action)}`)
    const scene = getBattleScene('alice')
    switch (action.a) {
        case 'setSelectedMove': {
            scene.setK('selectedMove', action.m)
            break
        } case 'fullReset': {
            scene.set(makeBattleState())
            break
        } case 'updateScreenSize': {
            const cursor = scene.select('allCharacters')
            for (const k of keys(cursor.get())) {
                const cu = cursor.select(k)
                const ch = cu.get()
                cu.setK('screenX', ch.x * action.size.width / 100)
                cu.setK('screenY', ch.y * action.size.height / 100)
            }
            break
        } case 'setIsBasicLoaded': {
            scene.setK('isBasicLoaded', action.v)
            break
        } case 'setIsDeluxeLoaded': {
            scene.setK('isDeluxeLoaded', action.v)
            break
        } default:
            throw new Error(`unknown action ${JSON.stringify(action)}`)
    }
    scene.flush()
}
export default dispatch

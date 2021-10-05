import { Loader } from 'pixi.js'
import orcWarrior from '../assets/chars/orcWarrior-200.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'
import frogknight from '../assets/Frog_Knight_sprite-200.png'
import healthTexture from '../assets/HEALTH_TEXTURE.png'
import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import skeleton from '../assets/Skeleton_Warrior_sprite-200.png'
import { dispatch } from 'data/battle'

const basicAssets = {
    frogknight,
    skeleton,
    fishstick,
    potion,
    bread,
    chestBody,
    chestLid,
    orcWarrior,
}
const deluxeAssets = {
    healthTexture,
}
const allAssets = { ...basicAssets, ...deluxeAssets }
export type AssetKey = keyof typeof allAssets
export default function loadAssets(onBasicLoaded: Callback, onDeluxeLoaded: Callback): void {
    const loaded = new Set(Object.keys(allAssets).filter(name => Loader.shared.resources[name]?.data != null))


    for (const [name, url] of Object.entries({ ...basicAssets, ...deluxeAssets })) {
        if (Loader.shared.resources[name]?.data == null) {
            Loader.shared.add(name, url)
        }
    }
    Loader.shared.load()

    // @ts-ignore
    Loader.shared.onLoad.add((_, { name }) => {
        loaded.add(name)
        if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
            dispatch({ a: 'setIsBasicLoaded', v: true })
            onBasicLoaded()
        }
        if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
            dispatch({ a: 'setIsDeluxeLoaded', v: true })
            onDeluxeLoaded()
        }
    })
    // return () => Loader.shared.onLoad.detach(cb)
}

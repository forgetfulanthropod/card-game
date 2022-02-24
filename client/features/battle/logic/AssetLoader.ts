import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

import font from '../../../assets/ARCADE_N_.ttf'
import check from '../../../assets/check.png'
import energy from '../assets/cards/energy cloud pixel 200.png'
import endTurnButton from '../assets/misc-png/BUTTON_END_TURN.png'
import gemButton from '../assets/misc-png/BUTTON_GEMS.png'
import chestBody from '../assets/misc-png/CHEST_BODY.png'
import chestLid from '../assets/misc-png/CHEST_LID.png'
import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import swordShield from '../assets/misc-png/INVENTORY_SWORDSHIELD.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import door from '../assets/misc-png/temp-door.png'
import { backgroundAssets } from './backgroundAssets'
import { cardAssets } from './cardAssets'
import { characterAssets } from './characterAssets'
import { characterStatusAssets } from './characterStatusAssets'
import { effectAssets } from './effectAssets'

Loader.registerPlugin(WebfontLoaderPlugin)

export type CharacterName = keyof typeof characterAssets

const basicAssets = {
    fishstick,
    potion,
    swordShield,
    bread,
    check,
    chestBody,
    chestLid,
    door,
    energy,
    endTurnButton,
    VT323: font,
    ...characterAssets,
    ...characterStatusAssets,
    ...backgroundAssets,
    ...effectAssets,
    ...cardAssets,
}
const deluxeAssets = {
    gemButton,
}
const allAssets = { ...basicAssets, ...deluxeAssets }

export type AssetKey = keyof typeof allAssets
// TODO: add back basic and deluxe
export default function loadAssets(): Promise<void> {
    let basicDone = false
    let deluxeDone = false

    const loaded = new Set(
        Object.keys(allAssets).filter(
            name => Loader.shared.resources[name]?.data != null
        )
    )

    for (const [name, url] of Object.entries({
        ...basicAssets,
        ...deluxeAssets,
    })) {
        if (Loader.shared.resources[name]?.data == null) {
            Loader.shared.add(name, url)
        }
    }

    Loader.shared.load()

    return new Promise(resolve => {
        // @ts-ignore
        Loader.shared.onLoad.add((_, { name }) => {
            loaded.add(name)
            if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
                // TODO:
                // dispatch({ a: 'setIsBasicLoaded', v: true })
                basicDone = true
            }
            if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
                // dispatch({ a: 'setIsDeluxeLoaded', v: true })
                deluxeDone = true
            }
            if (basicDone && deluxeDone) {
                resolve()
            }
        })
    })
    // return () => Loader.shared.onLoad.detach(cb)
}

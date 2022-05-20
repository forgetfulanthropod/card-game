import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

import energy from '@battleAssets/cards/energy cloud pixel 200.png'
import endTurnButton from '@battleAssets/misc-png/BUTTON_END_TURN.png'
import gemButton from '@battleAssets/misc-png/BUTTON_GEMS.png'
import chestBody from '@battleAssets/misc-png/CHEST_BODY.png'
import chestLid from '@battleAssets/misc-png/CHEST_LID.png'
import fishstick from '@battleAssets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '@battleAssets/misc-png/INVENTORY_POTION.png'
import swordShield from '@battleAssets/misc-png/INVENTORY_SWORDSHIELD.png'
import bread from '@battleAssets/misc-png/ITEM_BREAD.png'
import door from '@battleAssets/misc-png/temp-door.png'
import type { PixiTexture } from './mypixi'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import {
    backgroundAssets,
    characterAssets,
    characterStatusAssets,
    effectAssets,
    orbAssets,
    spineAssets,
} from '@/features/battle/elements/logic/allAssets'
import { font, check } from '@/assets'

Loader.registerPlugin(WebfontLoaderPlugin)

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
    ...orbAssets,
    ...characterAssets,
    ...characterStatusAssets,
    ...backgroundAssets,
    ...effectAssets,
    ...spineAssets,
}
const deluxeAssets = {
    gemButton,
}
const allAssets = { ...basicAssets, ...deluxeAssets }

export type AssetKey = keyof typeof allAssets
// TODO: add back basic and deluxe
export function loadAssets(): Promise<void> {
    const loaded = new Set(
        Object.keys(allAssets).filter(
            name => Loader.shared.resources[name]?.data != null
        )
    )

    for (const [name, url] of Object.entries(allAssets)) {
        if (Loader.shared.resources[name]?.data == null) {
            Loader.shared.add(name, url)
        }
    }

    Loader.shared.load()

    let basicDone = false
    let deluxeDone = false
    return new Promise(resolve => {
        // @ts-ignore
        Loader.shared.onLoad.add((_, { name }) => {
            loaded.add(name)
            if (Object.keys(basicAssets).every(k => loaded.has(k))) {
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

export function getTexture(assetId: AssetKey): PixiTexture {
    return (
        Loader.shared.resources?.[assetId]?.texture ??
        throwNull(`texture '${assetId}'`)
    )
}
export function hasTexture(assetId: AssetKey): boolean {
    return Loader.shared.resources?.[assetId] != null
}

import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

import endTurnButton from '@battleAssets/core-ui/end turn.png'
import confirmButton from '@battleAssets/core-ui/confirm_.png'
import gemButton from '@battleAssets/misc-png/BUTTON_GO.png'
import chestBody from '@battleAssets/misc-png/CHEST_BODY.png'
import chestLid from '@battleAssets/misc-png/CHEST_LID.png'
import fishstick from '@battleAssets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '@battleAssets/misc-png/INVENTORY_POTION.png'
import swordShield from '@battleAssets/misc-png/INVENTORY_SWORDSHIELD.png'
import bread from '@battleAssets/misc-png/ITEM_BREAD.png'
import door from '@battleAssets/misc-png/temp-door.png'
import { uniqBy } from 'lodash'
import type { PixiTexture } from './mypixi'
import {
    backgroundAssets,
    characterAssets,
    characterStatusAssets,
    effectAssets,
    orbAssets,
    spineAssets,
    cardAssets,
    healthBarAssets,
    intentAssets,
    signAssets,
} from '@/scenes'
import { check, fontAssets } from '@/assets'

Loader.registerPlugin(WebfontLoaderPlugin)

const allAssets = {
    fishstick,
    potion,
    swordShield,
    bread,
    check,
    chestBody,
    chestLid,
    door,
    endTurnButton,
    confirmButton,
    ...intentAssets,
    ...fontAssets,
    ...orbAssets,
    ...characterAssets,
    ...characterStatusAssets,
    ...backgroundAssets,
    ...signAssets,
    ...effectAssets,
    ...spineAssets,
    ...cardAssets,
    ...healthBarAssets,
    gemButton,
}

let resolveLoaderPromise = null as unknown as (_: unknown) => void
const promise = new Promise(res => (resolveLoaderPromise = res))

export function assetsLoadedPromise() {
    return promise
}

export type AssetKey = keyof typeof allAssets
// TODO: add back basic and deluxe
export function startLoadingAssets() {
    const unique = uniqBy(Object.entries(allAssets), ([name, _]) => name)

    for (const [name, url] of unique) {
        Loader.shared.add(name, url)
    }

    Loader.shared.load()
    Loader.shared.onComplete.once(() => resolveLoaderPromise(null))
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

export function isTextureKey(key: string): key is AssetKey {
    return hasTexture(key as AssetKey)
}

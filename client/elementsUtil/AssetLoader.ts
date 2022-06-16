import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'
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
    fishstick: 'misc-png/INVENTORY_FISHSTICK.png',
    potion: 'misc-png/INVENTORY_POTION.png',
    swordShield: 'misc-png/INVENTORY_SWORDSHIELD.png',
    bread: 'misc-png/ITEM_BREAD.png',
    check,
    chestBody: 'misc-png/CHEST_BODY.png',
    chestLid: 'misc-png/CHEST_LID.png',
    door: 'misc-png/temp-door.png',
    endTurnButton: 'core-ui/end turn.png',
    confirmButton: 'core-ui/confirm_.png',
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
    gemButton: 'misc-png/BUTTON_GO.png',
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
        Loader.shared.add(name, 'assets/' + url)
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

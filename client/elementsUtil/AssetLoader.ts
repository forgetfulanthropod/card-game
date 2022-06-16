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

const endTurnButton = 'core-ui/end turn.png'
const confirmButton = 'core-ui/confirm_.png'
const gemButton = 'misc-png/BUTTON_GO.png'
const chestBody = 'misc-png/CHEST_BODY.png'
const chestLid = 'misc-png/CHEST_LID.png'
const fishstick = 'misc-png/INVENTORY_FISHSTICK.png'
const potion = 'misc-png/INVENTORY_POTION.png'
const swordShield = 'misc-png/INVENTORY_SWORDSHIELD.png'
const bread = 'misc-png/ITEM_BREAD.png'
const door = 'misc-png/temp-door.png'

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

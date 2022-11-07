import { Loader, Resource } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'
import { uniqBy, upperFirst } from 'lodash'
import type { PixiTexture } from './mypixi'
import { loadAllAnimateFiles } from './myanimate'
import { AssetKey, AssetMaps, assetMaps, deluxeAssetMaps } from '@/assets'

import { keys } from 'shared/code'
import { SoundAssetKey } from '@/assets/deluxeAssetMaps'

Loader.registerPlugin(WebfontLoaderPlugin)

let resolveLoaderPromise = null as unknown as (_: unknown) => void
const promise = new Promise(res => (resolveLoaderPromise = res))

export function assetsLoadedPromise() {
    return promise
}

export function startLoadingAssets() {
    loadAssetMaps(assetMaps)

    Loader.shared.onComplete.once(() => {
        resolveLoaderPromise(null)

        loadAllAnimateFiles()
        loadAssetMaps(deluxeAssetMaps)
    })
}

function loadAssetMaps(assetMaps: AssetMaps) {
    const flatAssets: Record<string, string> = {}

    for (const map of Object.values(assetMaps)) {
        Object.assign(flatAssets, map)
    }

    const unique = uniqBy(Object.entries(flatAssets), ([name, _]) => name)

    for (const [name, url] of unique) {
        Loader.shared.add(name, 'assets/' + url)
    }

    Loader.shared.load()
}

export function playSound(assetId: SoundAssetKey): void {
    getSound(assetId)
        //@ts-expect-error
        ?.sound?.play?.()
}

export function getSound(assetId: string): object {
    return Loader.shared.resources?.[assetId]
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

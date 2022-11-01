import { Loader, Resource } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'
import { uniqBy } from 'lodash'
import type { PixiTexture } from './mypixi'
import { loadAllAnimateFiles } from './myanimate'
import { assetMaps } from '@/assets'
import deluxeAssetMap from '@/assets/deluxeAssetMap'
import { keys } from 'shared/code'

Loader.registerPlugin(WebfontLoaderPlugin)

const allAssets: Record<string, string> = {}
for (const map of Object.values(assetMaps)) {
    Object.assign(allAssets, map)
}

let resolveLoaderPromise = null as unknown as (_: unknown) => void
const promise = new Promise(res => (resolveLoaderPromise = res))

export function assetsLoadedPromise() {
    return promise
}

export type AssetKey = keyof typeof allAssets

export function startLoadingAssets() {
    const unique = uniqBy(Object.entries(allAssets), ([name, _]) => name)

    for (const [name, url] of unique) {
        Loader.shared.add(name, 'assets/' + url)
    }

    Loader.shared.load()
    Loader.shared.onComplete.once(() => {
        resolveLoaderPromise(null)

        keys(deluxeAssetMap).forEach(deluxeAssetKey => {
            Loader.shared.add(
                deluxeAssetKey,
                'assets/' + deluxeAssetMap[deluxeAssetKey]
            )
        })
        Loader.shared.load()
    })

    loadAllAnimateFiles()
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

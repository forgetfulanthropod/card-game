import { Loader, Resource } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'
import { uniqBy, upperFirst } from 'lodash'
import type { PixiTexture } from './mypixi'
// import { loadAllAnimateFiles } from './myanimate'
import { AssetKey, AssetMaps, assetMaps, deluxeAssetMaps } from '@/assets'

import { keys } from 'shared/code'
import {
    MusicAssetKey,
    SoundAssetKey,
    SoundEffectAssetKey,
} from '@/assets/deluxeAssetMaps'

Loader.registerPlugin(WebfontLoaderPlugin)

let resolveLoaderPromise = null as unknown as (_: unknown) => void
const promise = new Promise(res => (resolveLoaderPromise = res))

export let muteMusic = !!(localStorage.getItem('muteMusic') === 'true')
export let muteSFX = !!(localStorage.getItem('muteSFX') === 'true')
localStorage.setItem('muteMusic', muteMusic ? 'true' : 'false')
localStorage.setItem('muteSFX', muteSFX ? 'true' : 'false')

export const toggleMuteSFX = () => {
    muteSFX = !muteSFX
    localStorage.setItem('muteSFX', muteSFX ? 'true' : 'false')
}

export const toggleMuteMusic = () => {
    muteMusic = !muteMusic
    localStorage.setItem('muteMusic', muteMusic ? 'true' : 'false')
    if (muteMusic) {
        //@ts-expect-error
        latestLoopingSong?.pause()
    } else {
        //@ts-expect-error
        latestLoopingSong?.play()
    }
}

export function assetsLoadedPromise() {
    return promise
}

export function startLoadingAssets() {
    loadAssetMaps(assetMaps)

    Loader.shared.onComplete.once(() => {
        resolveLoaderPromise(null)

        // loadAllAnimateFiles()
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
        if (url.indexOf('SKIN') !== 0) Loader.shared.add(name, 'assets/' + url)
    }

    Loader.shared.load()
}

let latestLoopingSong: object | null = null
let successfullyLooping: boolean
let latestSongId: MusicAssetKey
let retrySongTimeout: number

export function playSongOnce(songId: MusicAssetKey) {
    loopSong(songId, false)
}

export function loopSong(songId: MusicAssetKey, loop = true): boolean {
    const sound = getSound(songId)

    latestSongId = songId

    //@ts-expect-error
    latestLoopingSong?.stop()

    //@ts-expect-error
    successfullyLooping = sound?.sound != null

    clearTimeout(retrySongTimeout)
    //@ts-expect-error
    retrySongTimeout = setTimeout(() => {
        if (!successfullyLooping) loopSong(latestSongId)
    }, 500)

    if (!successfullyLooping) return false

    //@ts-expect-error
    latestLoopingSong = sound?.sound

    if (muteMusic) {
        //@ts-expect-error
        latestLoopingSong?.pause()
    } else {
        //@ts-expect-error
        latestLoopingSong?.play?.({ loop })
    }

    return true
}

export function playSound(soundEffectId: SoundEffectAssetKey): void {
    if (muteSFX) {
        return
    }
    const sound = getSound(soundEffectId)
    //@ts-expect-error
    if (sound?.sound == null) return

    // @ts-expect-error
    sound.sound.volume = 0.5

    //@ts-expect-error
    sound?.sound?.play?.()
}

export function getSound(assetId: SoundAssetKey): object {
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

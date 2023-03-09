import { Assets } from 'pixi.js'
import { toString, uniqBy } from 'lodash'
import type { PixiTexture } from './mypixi'
// import { loadAllAnimateFiles } from './myanimate'
import { AssetKey, AssetMaps, assetMaps, deluxeAssetMaps } from '@/assets'

import { keys } from 'shared/code'
import {
    MusicAssetKey,
    SoundAssetKey,
    SoundEffectAssetKey,
} from '@/assets/deluxeAssetMaps'
import { getBooleanFromLocalStorage } from './userSettings'

let resolveLoaderPromise = null as unknown as (_: unknown) => void
const promise = new Promise(res => (resolveLoaderPromise = res))

export let muteMusic = getBooleanFromLocalStorage('muteMusic')
export let muteSFX = getBooleanFromLocalStorage('muteSFX')

export const toggleMuteSFX = () => {
    muteSFX = !muteSFX
    localStorage.setItem('muteSFX', toString(muteSFX))
}

export const toggleMuteMusic = () => {
    muteMusic = !muteMusic
    localStorage.setItem('muteMusic', toString(muteMusic))
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

export async function startLoadingAssets() {
    console.log('loading initial assets start')
    await loadAssetMaps(assetMaps)
    resolveLoaderPromise(null)
    console.log('loading initial assets finish')
    loadAssetMaps(deluxeAssetMaps)
    return true
}

async function loadAssetMaps(assetMaps: AssetMaps) {
    const flatAssets: Record<string, string> = {}

    for (const map of Object.values(assetMaps)) {
        Object.assign(flatAssets, map)
    }

    const unique = uniqBy(Object.entries(flatAssets), ([name, _]) => name)
        .filter(([_, url]) => url.indexOf('SKIN') !== 0)
        .map(([name, url]) => {
            Assets.add(name, 'assets/' + url)
            return name
        })

    await Promise.all(
        unique.map(async name => {
            await Assets.load(name).catch(() => false)
        })
    )
    return true
    //const uniqueNames = unique.map((data: [string, string]) => data[0])
    //const assetsPromise = Assets.load(uniqueNames)
    //return assetsPromise
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
    // @ts-expect-error
    if (latestLoopingSong) latestLoopingSong.volume = 0.5

    if (muteMusic) {
        //@ts-expect-error
        latestLoopingSong?.pause()
    } else {
        //@ts-expect-error
        latestLoopingSong?.play?.({ loop })
    }

    return !!latestLoopingSong
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
    return Assets.get(assetId)
}

export function getTexture(assetId: AssetKey): PixiTexture {
    return Assets.get(assetId) ?? throwNull(`texture '${assetId}'`)
}
export function hasTexture(assetId: AssetKey): boolean {
    return Assets.cache.has(assetId)
}

export function isTextureKey(key: string): key is AssetKey {
    return hasTexture(key as AssetKey)
}

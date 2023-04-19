import { sound } from '@pixi/sound'
import { Assets } from 'pixi.js'
import { toString, uniqBy } from 'lodash'
import type { PixiTexture } from './mypixi'
// import { loadAllAnimateFiles } from './myanimate'
import { AssetKey, AssetMaps, assetMaps, deluxeAssetMaps } from '@/assets'

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
    await loadAssetMaps(assetMaps, true)
    resolveLoaderPromise(null)
    console.log('loading initial assets finish')
    loadAssetMaps(deluxeAssetMaps, false)
    return true
}

async function loadAssetMaps(assetMaps: AssetMaps, showBar: boolean) {
    const flatAssets: Record<string, string> = {}

    for (const map of Object.values(assetMaps)) {
        Object.assign(flatAssets, map)
    }

    const unique = uniqBy(Object.entries(flatAssets), ([name, _]) => name)
        .filter(([_, url]) => url.indexOf('SKIN') !== 0)
        .map(([name, url]) => {
            const finalUrl = 'assets/' + url
            Assets.add(name, finalUrl)
            return [name, finalUrl]
        })

    let total = unique.length
    let loaded = 0
    let progressBarWrap: HTMLDivElement
    let progressBar: HTMLDivElement

    if (showBar) {
        progressBarWrap = document.createElement('div')
        progressBar = document.createElement('div')
        //@ts-expect-error
        progressBarWrap.style =
            'width:100%; height:20px; position:absolute; bottom:0; background-color: grey'
        progressBarWrap.appendChild(progressBar)
        //@ts-expect-error
        progressBar.style = 'width: 0%; height:100%; background-color: white'
        document.body.appendChild(progressBarWrap)
    }

    await Promise.all(
        unique.map(async ([name, url]) => {
            if (url.endsWith('.mp3')) {
                sound.add(name, url)
                total -= 1
                return true
            } else {
                return Assets.load(name)
                    .catch(() => false)
                    .finally(() => {
                        loaded += 1
                        const progress = loaded / total
                        if (showBar)
                            progressBar.style.width = `${progress * 100}%`
                    })
            }
        })
    ).finally(() => {
        if (showBar) document.body.removeChild(progressBarWrap)
    })
    return true
}

let latestLoopingSong: object | null = null
let successfullyLooping: boolean
let latestSongId: MusicAssetKey
let retrySongTimeout: number

export function playSongOnce(songId: MusicAssetKey) {
    loopSong(songId, false)
}

export function loopSong(songId: MusicAssetKey, loop = true) {
    const song = sound.find(songId)
    latestSongId = songId

    //@ts-expect-error
    latestLoopingSong?.stop()

    successfullyLooping = song != null

    clearTimeout(retrySongTimeout)
    //@ts-expect-error
    retrySongTimeout = setTimeout(() => {
        if (!successfullyLooping) loopSong(latestSongId)
    }, 500)

    if (!successfullyLooping) return false

    latestLoopingSong = song
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

export function playSound(soundEffectId: SoundAssetKey): void {
    if (muteSFX) {
        return
    }
    sound.play(soundEffectId, { volume: 0.5 })
}

export function getSound(assetId: SoundAssetKey): object {
    return sound.find(assetId)
}

export function hasSound(assetId: SoundAssetKey): boolean {
    return sound.exists(assetId)
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

import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

import font from '../../../assets/ARCADE_N_.ttf'
import check from '../../../assets/check.png'
import stanceAggressive from '../assets/aggressive stance.png'
import endTurnButton from '../assets/BUTTON_END_TURN.png'
import gemButton from '../assets/BUTTON_GEMS.png'
import cardBackPileSizeOverlay from '../assets/cards/card back pile size overlay.png'
import cardBack from '../assets/cards/card back.png'
import energy from '../assets/cards/energy cloud pixel 200.png'
import cardExample from '../assets/cards/Sweep The Leg.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'
import stanceDefensive from '../assets/defensive stance.png'
import healthBorder from '../assets/HEALTH_BORDER.png'
import healthTexture from '../assets/HEALTH_TEXTURE.png'
import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import swordShield from '../assets/misc-png/INVENTORY_SWORDSHIELD.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import stanceNeutral from '../assets/neutral stance.png'
import door from '../assets/temp-door.png'
import { backgroundAssets } from './backgroundAssets'
import { cardAssets } from './cardAssets'
import { characterAssets } from './characterAssets'
import { effectAssets } from './effectAssets'

Loader.registerPlugin(WebfontLoaderPlugin)

export type CharacterName = keyof typeof characterAssets

const basicAssets = {
    ...characterAssets,
    ...backgroundAssets,
    fishstick,
    potion,
    swordShield,
    bread,
    check,
    chestBody,
    chestLid,
    door,
    cardBackPileSizeOverlay,
    cardBack,
    cardExample,
    energy,
    endTurnButton,
    ...effectAssets,
    ...cardAssets,
}
const deluxeAssets = {
    stanceNeutral,
    stanceDefensive,
    stanceAggressive,
    gemButton,
    healthBorder,
    healthTexture,
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

    Loader.shared.add({ name: 'VT323', url: font })

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

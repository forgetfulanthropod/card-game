import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

import font from '../../../assets/ARCADE_N_.ttf'
import check from '../../../assets/check.png'
import stanceAggressive from '../assets/aggressive stance.png'
import hoolgans from '../assets/backgrounds/cave-final.png'
import fort from '../assets/backgrounds/fort-skeleton-temp.jpg'
import matcha from '../assets/backgrounds/matcha-caves.jpg'
import ninth from '../assets/backgrounds/ninth-trash-hole.png'
import gemButton from '../assets/BUTTON_GEMS.png'
import cardBack from '../assets/cards/card back.png'
import cardExample from '../assets/cards/Sweep The Leg.png'
import frogWizard from '../assets/chars/FrogWizard-cropped-200.png'
import notoriousBEAN from '../assets/chars/NotoriousBEAN200.png'
import orcWarrior from '../assets/chars/orcWarrior-200.png'
import warhog from '../assets/chars/warhog-200.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'
import stanceDefensive from '../assets/defensive stance.png'
import frogKnight from '../assets/Frog_Knight_sprite-200.png'
import bloatDemon from '../assets/gen0_cards/bloat_demon-200.png'
import bogSpirit from '../assets/gen0_cards/BogSpirit-200.png'
import bookle from '../assets/gen0_cards/bookle-200.png'
import bumbit from '../assets/gen0_cards/Bumbit-200.png'
import goblinDragon from '../assets/gen0_cards/Dragon_2-200.png'
import gnomeHooligan from '../assets/gen0_cards/Gnome_hooligan-200.png'
import greenJester from '../assets/gen0_cards/green_jester-200.png'
import jerry from '../assets/gen0_cards/Jerry-200.png'
import lichLord from '../assets/gen0_cards/LichLord-200.png'
import matchaGelatinCube from '../assets/gen0_cards/matcha_gelatin_cube-200.png'
import mimic from '../assets/gen0_cards/mimic-200.png'
import mushroomFarmer from '../assets/gen0_cards/Mushroom_Farmer2-200.png'
import penguinKnight from '../assets/gen0_cards/PenguinKnight-200.png'
import snacky from '../assets/gen0_cards/Snacky-200.png'
import theHatefly from '../assets/gen0_cards/TheHatefly-200.png'
import trioOfFools from '../assets/gen0_cards/TrioOfFools-200.png'
import wimpyGuard from '../assets/gen0_cards/WimpyGuard-200.png'
import healthBorder from '../assets/HEALTH_BORDER.png'
import healthTexture from '../assets/HEALTH_TEXTURE.png'
import fishstick from '../assets/misc-png/INVENTORY_FISHSTICK.png'
import potion from '../assets/misc-png/INVENTORY_POTION.png'
import swordShield from '../assets/misc-png/INVENTORY_SWORDSHIELD.png'
import bread from '../assets/misc-png/ITEM_BREAD.png'
import stanceNeutral from '../assets/neutral stance.png'
import skeletonWarrior from '../assets/Skeleton_Warrior_sprite-200.png'
import door from '../assets/temp-door.png'

export const backgrounds = {
    'Hooligan’s Bluff': hoolgans,
    'The Matcha Caves': matcha,
    'Fort Skeleton': fort,
    'The Ninth Trash Hole of Hell': ninth,
}

Loader.registerPlugin(WebfontLoaderPlugin)

const characterAssets = {
    bloatDemon,
    bogSpirit,
    bookle,
    bumbit,
    frogKnight,
    frogWizard,
    gnomeHooligan,
    goblinDragon,
    greenJester,
    jerry,
    lichLord,
    matchaGelatinCube,
    mimic,
    mushroomFarmer,
    notoriousBEAN,
    orcWarrior,
    penguinKnight,
    skeletonWarrior,
    snacky,
    theHatefly,
    trioOfFools,
    warhog,
    wimpyGuard,
}
export type CharacterName = keyof typeof characterAssets

const basicAssets = {
    ...characterAssets,
    ...backgrounds,
    fishstick,
    potion,
    swordShield,
    bread,
    check,
    chestBody,
    chestLid,
    door,
    cardBack,
    cardExample,
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

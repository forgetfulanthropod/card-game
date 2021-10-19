import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

// import font from '../../../assets/VT323-Regular.ttf'
import font from '../../../assets/ARCADE_N_.ttf'
import check from '../../../assets/check.png'
import stanceAggressive from '../assets/aggressive stance.png'
import fort from '../assets/backgrounds/fort-skeleton-temp.jpg'
import hoolgans from '../assets/backgrounds/hoolgans-bluff-temp.jpg'
import ninth from '../assets/backgrounds/ninth-trash-hole.png'
import gemButton from '../assets/BUTTON_GEMS.png'
import bloatDemon from '../assets/cards/bloat_demon-200.png'
import bogSpirit from '../assets/cards/BogSpirit-200.png'
import bookle from '../assets/cards/bookle-200.png'
import bumbit from '../assets/cards/Bumbit-200.png'
import goblinDragon from '../assets/cards/Dragon_2-200.png'
import gnomeHooligan from '../assets/cards/Gnome_hooligan-200.png'
import greenJester from '../assets/cards/green_jester-200.png'
import jerry from '../assets/cards/Jerry-200.png'
import lichLord from '../assets/cards/LichLord-200.png'
import matchaGelatinCube from '../assets/cards/matcha_gelatin_cube-200.png'
import mimic from '../assets/cards/mimic-200.png'
import mushroomFarmer from '../assets/cards/Mushroom_Farmer2-200.png'
import penguinKnight from '../assets/cards/PenguinKnight-200.png'
import snacky from '../assets/cards/Snacky-200.png'
import theHatefly from '../assets/cards/TheHatefly-200.png'
import trioOfFools from '../assets/cards/TrioOfFools-200.png'
import wimpyGuard from '../assets/cards/WimpyGuard-200.png'
import frogWizard from '../assets/chars/FrogWizard-cropped-200.png'
import notoriousBEAN from '../assets/chars/NotoriousBEAN200.png'
import orcWarrior from '../assets/chars/orcWarrior-200.png'
import warhog from '../assets/chars/warhog-200.png'
import chestBody from '../assets/CHEST_BODY.png'
import chestLid from '../assets/CHEST_LID.png'
import stanceDefensive from '../assets/defensive stance.png'
import frogKnight from '../assets/Frog_Knight_sprite-200.png'
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
    'The Matcha Caves': 'matcha',
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
export const characterAssetKeys = Object.keys(characterAssets) as CharacterName[]

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
export default function loadAssets(onBasicLoaded: Callback, onDeluxeLoaded: Callback): void {
    const loaded = new Set(Object.keys(allAssets).filter(name => Loader.shared.resources[name]?.data != null))


    for (const [name, url] of Object.entries({ ...basicAssets, ...deluxeAssets })) {
        if (Loader.shared.resources[name]?.data == null) {
            Loader.shared.add(name, url)
        }
    }

    Loader.shared.add({ name: 'VT323', url: font })

    Loader.shared.load()

    // @ts-ignore
    Loader.shared.onLoad.add((_, { name }) => {
        loaded.add(name)
        if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
            // TODO:
            // dispatch({ a: 'setIsBasicLoaded', v: true })
            onBasicLoaded()
        }
        if (Object.keys(deluxeAssets).every(k => loaded.has(k))) {
            // dispatch({ a: 'setIsDeluxeLoaded', v: true })
            onDeluxeLoaded()
        }
    })

    // return () => Loader.shared.onLoad.detach(cb)
}

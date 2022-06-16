import type { VisibleEffect } from './assetTypes'

export const rootAssets = {
    fishstick: 'misc-png/INVENTORY_FISHSTICK.png',
    potion: 'misc-png/INVENTORY_POTION.png',
    swordShield: 'misc-png/INVENTORY_SWORDSHIELD.png',
    bread: 'misc-png/ITEM_BREAD.png',

    chestBody: 'misc-png/CHEST_BODY.png',
    chestLid: 'misc-png/CHEST_LID.png',
    door: 'misc-png/temp-door.png',
    endTurnButton: 'core-ui/end turn.png',
    confirmButton: 'core-ui/confirm_.png',
    gemButton: 'misc-png/BUTTON_GO.png',
}

export const fontAssets = {
    bigFont: 'root/fonts/Aesthet Nova/Aesthet Nova W05 Black.ttf',
    sansFont: 'root/fonts/Space Grotesk/SpaceGrotesk-VariableFont_wght.ttf',
    monoFont: 'root/fonts/Space Mono/SpaceMono-Bold.ttf',
} as const

// import fort from '@battleAssets/backgrounds/fort-skeleton-temp.jpg'
// import matcha from '@battleAssets/backgrounds/matcha-caves.jpg'
// const ninth = 'backgrounds/ninth-trash-hole.png'

const caveFinal = 'backgrounds/cave-final.png'
export const backgroundAssets = {
    'Skelepit Dungeon': caveFinal,
    'Hooligan’s Bluff': caveFinal,
    'The Matcha Caves': caveFinal,
    'Fort Skeleton': caveFinal,
    'The Ninth Trash Hole of Hell': caveFinal,
}
export const cardArtAssets = {
    cardBodySlam: 'cards/Body Slam.png',
    cardJab: 'cards/Jab.png',
    cardSweepTheLeg: 'cards/Sweep The Leg.png',
    cardShield: 'cards/Shield.png',
    cardStrike: 'cards/Strike.png',
    cardShieldOfLight: 'cards/Shield of Light.png',
}

export const cardTypeAssets = {
    cardTypeAttack: 'cards/parts/Attack.png',
    cardTypeDefense: 'cards/parts/Defense.png',
    cardTypeEnchantment: 'cards/parts/Enchantment.png',
    cardTypeUtility: 'cards/parts/Utility.png',
}

export const cardAssets = {
    remainingEnergy: 'cards/energy flame.png',
    cardEnergy: 'cards/parts/energy.png',
    cardBackPileSizeOverlay: 'cards/card back pile size overlay.png',
    cardBack: 'cards/card back.png',
    ...cardArtAssets,
    ...cardTypeAssets,
} as const

export const characterAssets = {
    bloatDemon: 'gen0_cards/bloat_demon-200.png',
    bogSpirit: 'gen0_cards/BogSpirit-200.png',
    bookle: 'gen0_cards/bookle-200.png',
    bumbit: 'gen0_cards/Bumbit-200.png',
    frogKnight: 'chars/Frog_Knight_sprite-200.png',
    frogWizard: 'chars/FrogWizard-cropped-200.png',
    gnomeHooligan: 'gen0_cards/Gnome_hooligan-200.png',
    goblinDragon: 'gen0_cards/Dragon_2-200.png',
    greenJester: 'gen0_cards/green_jester-200.png',
    jerry: 'gen0_cards/Jerry-200.png',
    lichLord: 'gen0_cards/LichLord-200.png',
    matchaGelatinCube: 'gen0_cards/matcha_gelatin_cube-200.png',
    mimic: 'gen0_cards/mimic-200.png',
    mushroomFarmer: 'gen0_cards/Mushroom_Farmer2-200.png',
    notoriousBEAN: 'chars/NotoriousBEAN200.png',
    orcWarrior: 'chars/orcWarrior-200.png',
    penguinKnight: 'gen0_cards/PenguinKnight-200.png',
    skeletonWarrior: 'chars/Skeleton_Warrior_sprite-200.png',
    snacky: 'gen0_cards/Snacky-200.png',
    theHatefly: 'gen0_cards/TheHatefly-200.png',
    trioOfFools: 'gen0_cards/TrioOfFools-200.png',
    warhog: 'chars/warhog-200.png',
    wimpyGuard: 'gen0_cards/WimpyGuard-200.png',
    halfdan: 'chars/halfdan.png',
    cultist: 'chars/cultist.png',
    toadmaw: 'chars/toadmaw.png',
    bosshogJurgen: 'chars/bosshogJurgen.png',
}

export const characterStatusAssets = {
    stanceNeutral: 'char status/neutral stance.png',
    stanceDefensive: 'char status/defensive stance.png',
    stanceAggressive: 'char status/aggressive stance.png',
    healthBorder: 'char status/HEALTH_BORDER.png',
    healthTexture: 'char status/HEALTH_TEXTURE.png',
    blockIcon: 'char status/block icon.png',
}
export const effectAssets: {
    [K in VisibleEffect as `effect${Capitalize<K>}`]: string
} = {
    effectVulnerable: 'effects/vulnerable_v2.png',
    effectBleed: 'effects/bleed.png',
    effectDebilitated: 'effects/debilitated.png',
    effectFatigue: 'effects/fatigue.png',
    // effectPiercing,
    effectPoison: 'effects/poison_skull.png',
    effectStunned: 'effects/stunned.png',
    effectUnguarded: 'effects/unguarded_v2.png',
}

export const healthBarAssets = {
    healthBarAggressive: 'health bar/Aggressive Stance.png',
    healthBarAvoidant: 'health bar/Avoidant stance.png',
    healthBarDoT: 'health bar/DoT.png',
    healthBarHealth: 'health bar/Health.png',
    healthBarBacking: 'health bar/Healthbar Backing.png',
    healthBarHighlight: 'health bar/Highlight.png',
    healthBarDamage: 'health bar/Regular Damage.png',
    healthBarShadow: 'health bar/Shadow.png',
}

export const intentAssets = {
    enemyIntentArrow: 'intents/arrow_3.png',
    floatingIntentAmount: 'intents/floating intent amount.png',
    blockIntent: 'intents/npc/Shield intent.png',
}

export const orbAssets = {
    orbOfEnergy: 'char status/orbs/lightning.png',
    orbOfFrost: 'char status/orbs/lightning.png',
    orbOfLightning: 'char status/orbs/lightning.png',
    orbOfProtection: 'char status/orbs/protection.png',
}

export const signAssets = {
    skelepitDungeonSign: 'signs/skelepit dungeon.webp',
}

export const characterClassAssets = {
    wizardClassIcon: 'character classes/wizard glow.png',
    knightClassIcon: 'character classes/knight glow.png',
    clericClassIcon: 'character classes/cleric glow.png',
} as const

export const spineAssets = {
    frogKnightSpine: 'spine/frogKnight/FrogKnight.json',
    mushroomFarmerSpine:
        'spine/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.json',
    skeletonWarriorSpine:
        'spine/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.json',
    matchaGelatinCubeSpine:
        'spine/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.json',
} as const

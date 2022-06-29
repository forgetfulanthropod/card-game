import type { VisibleEffect } from './assetTypes'

export const rootAssets = {
    fishstick: 'misc-png/INVENTORY_FISHSTICK.webp',
    potion: 'misc-png/INVENTORY_POTION.webp',
    swordShield: 'misc-png/INVENTORY_SWORDSHIELD.webp',
    bread: 'misc-png/ITEM_BREAD.webp',

    chestBody: 'misc-png/CHEST_BODY.webp',
    chestLid: 'misc-png/CHEST_LID.webp',
    door: 'misc-png/temp-door.webp',
    endTurnButton: 'core-ui/end turn.webp',
    confirmButton: 'core-ui/confirm_.webp',
    abilityButton: 'core-ui/ability pill.svg',
    goButton: 'core-ui/go.webp',
}

export const fontAssets = {
    bigFont: 'root/fonts/Aesthet Nova/Aesthet Nova W05 Black.ttf',
    sansFont: 'root/fonts/Space Grotesk/SpaceGrotesk-VariableFont_wght.ttf',
    monoFont: 'root/fonts/Space Mono/SpaceMono-Bold.ttf',
} as const

// import fort from '@battleAssets/backgrounds/fort-skeleton-temp.jpg'
// import matcha from '@battleAssets/backgrounds/matcha-caves.jpg'
// const ninth = 'backgrounds/ninth-trash-hole.webp'

const caveFinal = 'backgrounds/Matcha_Caves.webp'
export const dungeonBackgroundAssets = {
    'Skelepit Dungeon': caveFinal,
    // 'Hooligan’s Bluff': caveFinal,
    // 'The Matcha Caves': caveFinal,
    // 'Fort Skeleton': caveFinal,
    // 'The Ninth Trash Hole of Hell': caveFinal,
}

export const entrySceneBackgrounds = {
    skelepitEntrySceneBackground: 'backgrounds/temple_background_3.webp',
}

export const cardArtAssets = {
    cardBodySlam: 'cards/Body Slam.webp',
    cardJab: 'cards/Jab.webp',
    cardSweepTheLeg: 'cards/Sweep The Leg.webp',
    cardShield: 'cards/Shield.webp',
    cardStrike: 'cards/Strike.webp',
    cardShieldOfLight: 'cards/Shield of Light.webp',
}

export const cardTypeAssets = {
    cardTypeAttack: 'cards/parts/Attack.webp',
    cardTypeDefense: 'cards/parts/Defense.webp',
    cardTypeEnchantment: 'cards/parts/Enchantment.webp',
    cardTypeUtility: 'cards/parts/Utility.webp',
}

export const cardAssets = {
    remainingEnergy: 'cards/energy flame.webp',
    cardEnergy: 'cards/parts/energy.webp',
    cardBackPileSizeOverlay: 'cards/card back pile size overlay.webp',
    cardBack: 'cards/card back.webp',
    ...cardArtAssets,
    ...cardTypeAssets,
} as const

// export const characterAssets = {
//     bloatDemon: 'gen0_cards/bloat_demon-200.webp',
//     bogSpirit: 'gen0_cards/BogSpirit-200.webp',
//     bookle: 'gen0_cards/bookle-200.webp',
//     bumbit: 'gen0_cards/Bumbit-200.webp',
//     frogKnight: 'chars/Frog_Knight_sprite-200.webp',
//     frogWizard: 'chars/FrogWizard-cropped-200.webp',
//     gnomeHooligan: 'gen0_cards/Gnome_hooligan-200.webp',
//     goblinDragon: 'gen0_cards/Dragon_2-200.webp',
//     greenJester: 'gen0_cards/green_jester-200.webp',
//     jerry: 'gen0_cards/Jerry-200.webp',
//     lichLord: 'gen0_cards/LichLord-200.webp',
//     matchaGelatinCube: 'gen0_cards/matcha_gelatin_cube-200.webp',
//     mimic: 'gen0_cards/mimic-200.webp',
//     mushroomFarmer: 'gen0_cards/Mushroom_Farmer2-200.webp',
//     notoriousBEAN: 'chars/NotoriousBEAN200.webp',
//     orcWarrior: 'chars/orcWarrior-200.webp',
//     penguinKnight: 'gen0_cards/PenguinKnight-200.webp',
//     skeletonWarrior: 'chars/Skeleton_Warrior_sprite-200.webp',
//     snacky: 'gen0_cards/Snacky-200.webp',
//     theHatefly: 'gen0_cards/TheHatefly-200.webp',
//     trioOfFools: 'gen0_cards/TrioOfFools-200.webp',
//     warhog: 'chars/warhog-200.webp',
//     wimpyGuard: 'gen0_cards/WimpyGuard-200.webp',
//     halfdan: 'chars/halfdan.webp',
//     cultist: 'chars/cultist.webp',
//     toadmaw: 'chars/toadmaw.webp',
//     bosshogJurgen: 'chars/bosshogJurgen.webp',
// }

export const characterStatusAssets = {
    stanceNeutral: 'char status/neutral stance.webp',
    stanceDefensive: 'char status/defensive stance.webp',
    stanceAggressive: 'char status/aggressive stance.webp',
    healthBorder: 'char status/HEALTH_BORDER.webp',
    healthTexture: 'char status/HEALTH_TEXTURE.webp',
    blockIcon: 'char status/block icon.webp',
}
export const effectAssets: {
    [K in VisibleEffect as `effect${Capitalize<K>}`]: string
} = {
    effectVulnerable: 'effects/vulnerable_v2.webp',
    effectBleed: 'effects/bleed.webp',
    effectDebilitated: 'effects/debilitated.webp',
    effectFatigue: 'effects/fatigue.webp',
    // effectPiercing,
    effectPoison: 'effects/poison_skull.webp',
    effectStunned: 'effects/stunned.webp',
    effectUnguarded: 'effects/unguarded_v2.webp',
}

export const healthBarAssets = {
    healthBarAggressive: 'health bar/Aggressive Stance.webp',
    healthBarAvoidant: 'health bar/Avoidant stance.webp',
    healthBarDoT: 'health bar/DoT.webp',
    healthBarHealth: 'health bar/Health.webp',
    healthBarBacking: 'health bar/Healthbar Backing.webp',
    healthBarHighlight: 'health bar/Highlight.webp',
    healthBarDamage: 'health bar/Regular Damage.webp',
    healthBarShadow: 'health bar/Shadow.webp',
}

export const intentAssets = {
    enemyIntentArrowHead: 'intents/arrow_4_head.webp',
    enemyIntentArrowTail: 'intents/arrow_4_tail.webp',
    floatingIntentAmount: 'intents/floating intent amount.webp',
    blockIntent: 'intents/npc/Shield intent.webp',
}

export const orbAssets = {
    orbOfEnergy: 'char status/orbs/lightning.webp',
    orbOfFrost: 'char status/orbs/lightning.webp',
    orbOfLightning: 'char status/orbs/lightning.webp',
    orbOfProtection: 'char status/orbs/protection.webp',
}

export const signAssets = {
    skelepitDungeonSign: 'signs/skelepit dungeon.webp',
}

export const characterClassAssets = {
    wizardClassIcon: 'character classes/wizard glow.webp',
    knightClassIcon: 'character classes/knight glow.webp',
    clericClassIcon: 'character classes/cleric glow.webp',
    rogueClassIcon: 'character classes/rogue glow.webp',
    bardClassIcon: 'character classes/bard glow.webp',
} as const

export const spineAssets = {
    frogKnightSpine: 'spine/frogKnight/FrogKnight.json',
    mushroomFarmerSpine:
        'spine/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.json',
    skeletonWarriorSpine:
        'spine/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.json',
    matchaGelatinCubeSpine:
        'spine/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.json',
    gnomeHooliganSpine: 'spine/gnomeHooligan/Gnome_Hooligan.json',
    jerrySpine: 'spine/jerry/Jerry_MJ_Rig_Prep_v4.json',
    warhogSpine: 'spine/warhog/Warhog.json',
    // frogKnightSpineWebp: 'spine/frogKnight/FrogKnight.webp',
    // mushroomFarmerSpineWebp:
    //     'spine/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.webp',
    // skeletonWarriorSpineWebp:
    //     'spine/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.webp',
    // matchaGelatinCubeSpineWebp:
    //     'spine/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.webp',
} as const

export const matchaEntryAssets = {
    pedestalRay0: 'scenes/entry matcha/Pedestal_ray_Left.png',
    pedestalRay1: 'scenes/entry matcha/Pedestal_ray_Right.png',
    pedestalRay2: 'scenes/entry matcha/Pedestal_ray.png',
    selectCharacterArrow: 'scenes/entry matcha/select_arrow.webp',
}

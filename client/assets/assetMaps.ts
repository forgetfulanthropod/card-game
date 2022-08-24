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
    skelepitEntrySceneBackground: 'backgrounds/temple_background_4.webp',
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
    effectBleed: 'effects/bleed.webp',
    effectDebilitated: 'effects/debilitated.webp',
    effectFatigue: 'effects/fatigue.webp',
    // effectPiercing,
    // temp: what is strongblock icon?
    effectStrongblock: 'intents/npc/Shield intent.webp',
    effectTrance: 'effects/magicalStorm.webp',
    effectPoison: 'effects/poison_skull.webp',
    effectStunned: 'effects/stunned.webp',
    effectUnguarded: 'effects/unguarded_v2.webp',
    effectVulnerable: 'effects/vulnerable_v2.webp',
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
    orbOfFrost: 'char status/orbs/frost.webp',
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
    frogKnightSpine: 'spines/characters/frogKnight/FrogKnight.json',
    mushroomFarmerSpine:
        'spines/characters/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.json',
    penguinKnightSpine: 'spines/characters/penguinKnight/imported.json',
    skeletonWarriorSpine:
        'spines/characters/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.json',
    skeletonWarriorNPCSpine:
        'spines/characters/skeletonWarriorNPC/Skeleton_Warrior_MJ_Rig_Prep_v02.json',
    matchaGelatinCubeSpine:
        'spines/characters/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.json',
    matchaGelatinCubeNPCSpine:
        'spines/characters/matchaGelatinCubeNPC/Matcha_MJ_Rig_Prep_v04.json',
    gnomeHooliganSpine: 'spines/characters/gnomeHooligan/Gnome_Hooligan.json',
    jerrySpine: 'spines/characters/jerry/Jerry_MJ_Rig_Prep_v4.json',
    warhogSpine: 'spines/characters/warhog/Warhog.json',
    damageSpine: 'spines/damage/Text.json',
    // frogKnightSpineWebp: 'spine/frogKnight/FrogKnight.webp',
    // mushroomFarmerSpineWebp:
    //     'spine/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.webp',
    // skeletonWarriorSpineWebp:
    //     'spine/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.webp',
    // matchaGelatinCubeSpineWebp:
    //     'spine/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.webp',
} as const

export const matchaEntryAssets = {
    pedestalRay0: 'scenes/entry matcha/Pedestal_ray_Left.webp',
    pedestalRay1: 'scenes/entry matcha/Pedestal_ray_Right.webp',
    pedestalRay2: 'scenes/entry matcha/Pedestal_ray.webp',
    selectCharacterArrow: 'scenes/entry matcha/select_arrow.webp',
}

export const characterProfileAssets = {
    bookleProfile: 'character profiles/bookle.webp',
    frogKnightProfile: 'character profiles/frogKnight.webp',
    gnomeHooliganProfile: 'character profiles/gnomeHooligan.webp',
    jerryProfile: 'character profiles/jerry.webp',
    matchaGelatinCubeProfile: 'character profiles/matchaGelatinCube.webp',
    mushroomFarmerProfile: 'character profiles/mushroomFarmer.webp',
    penguinKnightProfile: 'character profiles/penguinKnight.webp',
    skeletonWarriorProfile: 'character profiles/skeletonWarrior.webp',
    warhogProfile: 'character profiles/warhog.webp',
}

export const sequences = {
    // @index(['../../public/assets/fx sequences/**/*.svg'], f => `${f.name}: '${f.path.replace('../../public/assets/', '')}.svg',`)
    KC_FX_Block_v4_001_0001:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0001.svg',
    KC_FX_Block_v4_001_0002:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0002.svg',
    KC_FX_Block_v4_001_0003:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0003.svg',
    KC_FX_Block_v4_001_0004:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0004.svg',
    KC_FX_Block_v4_001_0005:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0005.svg',
    KC_FX_Block_v4_001_0006:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0006.svg',
    KC_FX_Block_v4_001_0007:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0007.svg',
    KC_FX_Block_v4_001_0008:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0008.svg',
    KC_FX_Block_v4_001_0009:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0009.svg',
    KC_FX_Block_v4_001_0010:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0010.svg',
    KC_FX_Block_v4_001_0011:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0011.svg',
    KC_FX_Block_v4_001_0012:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0012.svg',
    KC_FX_Block_v4_001_0013:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0013.svg',
    KC_FX_Block_v4_001_0014:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0014.svg',
    KC_FX_Block_v4_001_0015:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0015.svg',
    KC_FX_Block_v4_001_0016:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0016.svg',
    KC_FX_Block_v4_001_0017:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0017.svg',
    KC_FX_Block_v4_001_0018:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0018.svg',
    KC_FX_Block_v4_001_0019:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0019.svg',
    KC_FX_Block_v4_001_0020:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0020.svg',
    KC_FX_Block_v4_001_0021:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0021.svg',
    KC_FX_Block_v4_001_0022:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0022.svg',
    KC_FX_Block_v4_001_0023:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0023.svg',
    KC_FX_Block_v4_001_0024:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0024.svg',
    KC_FX_Block_v4_001_0025:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0025.svg',
    KC_FX_Block_v4_001_0026:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0026.svg',
    KC_FX_Block_v4_001_0027:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0027.svg',
    KC_FX_Block_v4_001_0028:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0028.svg',
    KC_FX_Block_v4_001_0029:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0029.svg',
    KC_FX_Block_v4_001_0030:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0030.svg',
    KC_FX_Block_v4_001_0031:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0031.svg',
    KC_FX_Block_v4_001_0032:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0032.svg',
    KC_FX_Block_v4_001_0033:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0033.svg',
    KC_FX_Block_v4_001_0034:
        'fx sequences/KC_FX_Block_v3_001/KC_FX_Block_v4_001_0034.svg',
    KC_FX_BlockBreak_v1_001_0001:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0001.svg',
    KC_FX_BlockBreak_v1_001_0002:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0002.svg',
    KC_FX_BlockBreak_v1_001_0003:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0003.svg',
    KC_FX_BlockBreak_v1_001_0004:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0004.svg',
    KC_FX_BlockBreak_v1_001_0005:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0005.svg',
    KC_FX_BlockBreak_v1_001_0006:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0006.svg',
    KC_FX_BlockBreak_v1_001_0007:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0007.svg',
    KC_FX_BlockBreak_v1_001_0008:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0008.svg',
    KC_FX_BlockBreak_v1_001_0009:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0009.svg',
    KC_FX_BlockBreak_v1_001_0010:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0010.svg',
    KC_FX_BlockBreak_v1_001_0011:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0011.svg',
    KC_FX_BlockBreak_v1_001_0012:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0012.svg',
    KC_FX_BlockBreak_v1_001_0013:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0013.svg',
    KC_FX_BlockBreak_v1_001_0014:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0014.svg',
    KC_FX_BlockBreak_v1_001_0015:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0015.svg',
    KC_FX_BlockBreak_v1_001_0016:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0016.svg',
    KC_FX_BlockBreak_v1_001_0017:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0017.svg',
    KC_FX_BlockBreak_v1_001_0018:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0018.svg',
    KC_FX_BlockBreak_v1_001_0019:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0019.svg',
    KC_FX_BlockBreak_v1_001_0020:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0020.svg',
    KC_FX_BlockBreak_v1_001_0021:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0021.svg',
    KC_FX_BlockBreak_v1_001_0022:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0022.svg',
    KC_FX_BlockBreak_v1_001_0023:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0023.svg',
    KC_FX_BlockBreak_v1_001_0024:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0024.svg',
    KC_FX_BlockBreak_v1_001_0025:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0025.svg',
    KC_FX_BlockBreak_v1_001_0026:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0026.svg',
    KC_FX_BlockBreak_v1_001_0027:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0027.svg',
    KC_FX_BlockBreak_v1_001_0028:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0028.svg',
    KC_FX_BlockBreak_v1_001_0029:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0029.svg',
    KC_FX_BlockBreak_v1_001_0030:
        'fx sequences/KC_FX_BlockBreak_v1_001/KC_FX_BlockBreak_v1_001_0030.svg',
    KC_FX_Defense_v1_0010001:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010001.svg',
    KC_FX_Defense_v1_0010002:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010002.svg',
    KC_FX_Defense_v1_0010003:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010003.svg',
    KC_FX_Defense_v1_0010004:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010004.svg',
    KC_FX_Defense_v1_0010005:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010005.svg',
    KC_FX_Defense_v1_0010006:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010006.svg',
    KC_FX_Defense_v1_0010007:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010007.svg',
    KC_FX_Defense_v1_0010008:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010008.svg',
    KC_FX_Defense_v1_0010009:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010009.svg',
    KC_FX_Defense_v1_0010010:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010010.svg',
    KC_FX_Defense_v1_0010011:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010011.svg',
    KC_FX_Defense_v1_0010012:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010012.svg',
    KC_FX_Defense_v1_0010013:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010013.svg',
    KC_FX_Defense_v1_0010014:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010014.svg',
    KC_FX_Defense_v1_0010015:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010015.svg',
    KC_FX_Defense_v1_0010016:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010016.svg',
    KC_FX_Defense_v1_0010017:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010017.svg',
    KC_FX_Defense_v1_0010018:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010018.svg',
    KC_FX_Defense_v1_0010019:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010019.svg',
    KC_FX_Defense_v1_0010020:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010020.svg',
    KC_FX_Defense_v1_0010021:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010021.svg',
    KC_FX_Defense_v1_0010022:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010022.svg',
    KC_FX_Defense_v1_0010023:
        'fx sequences/KC_FX_BlockDefense_v1_001/KC_FX_Defense_v1_0010023.svg',
    KC_FX_Poison001_Player0001:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0001.svg',
    KC_FX_Poison001_Player0002:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0002.svg',
    KC_FX_Poison001_Player0003:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0003.svg',
    KC_FX_Poison001_Player0004:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0004.svg',
    KC_FX_Poison001_Player0005:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0005.svg',
    KC_FX_Poison001_Player0006:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0006.svg',
    KC_FX_Poison001_Player0007:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0007.svg',
    KC_FX_Poison001_Player0008:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0008.svg',
    KC_FX_Poison001_Player0009:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0009.svg',
    KC_FX_Poison001_Player0010:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0010.svg',
    KC_FX_Poison001_Player0011:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0011.svg',
    KC_FX_Poison001_Player0012:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0012.svg',
    KC_FX_Poison001_Player0013:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0013.svg',
    KC_FX_Poison001_Player0014:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0014.svg',
    KC_FX_Poison001_Player0015:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0015.svg',
    KC_FX_Poison001_Player0016:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0016.svg',
    KC_FX_Poison001_Player0017:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0017.svg',
    KC_FX_Poison001_Player0018:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0018.svg',
    KC_FX_Poison001_Player0019:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0019.svg',
    KC_FX_Poison001_Player0020:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0020.svg',
    KC_FX_Poison001_Player0021:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0021.svg',
    KC_FX_Poison001_Player0022:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0022.svg',
    KC_FX_Poison001_Player0023:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0023.svg',
    KC_FX_Poison001_Player0024:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0024.svg',
    KC_FX_Poison001_Player0025:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0025.svg',
    KC_FX_Poison001_Player0026:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0026.svg',
    KC_FX_Poison001_Player0027:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0027.svg',
    KC_FX_Poison001_Player0028:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0028.svg',
    KC_FX_Poison001_Player0029:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0029.svg',
    KC_FX_Poison001_Player0030:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0030.svg',
    KC_FX_Poison001_Player0031:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0031.svg',
    KC_FX_Poison001_Player0032:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0032.svg',
    KC_FX_Poison001_Player0033:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0033.svg',
    KC_FX_Poison001_Player0034:
        'fx sequences/KC_FX_Poison001_Player/KC_FX_Poison001_Player0034.svg',
    // @endindex
}

export const mapAssets = {
    mapBg: 'hex map/dungeon test bg for export.mp4',
    mapFire: 'hex map/fire test.mov',
}

export const mapTileAssets = {
    mapTile1: 'hex map/Tile 1.png',
    mapTile2: 'hex map/Tile 2.png',
    mapTile3: 'hex map/Tile 3.png',
    mapTile4: 'hex map/Tile 4.png',
    mapTile5: 'hex map/Tile 5.png',
    mapTile6: 'hex map/Tile 6.png',
    mapTile7: 'hex map/Tile 7.png',
    mapTile8: 'hex map/Tile 8.png',
}

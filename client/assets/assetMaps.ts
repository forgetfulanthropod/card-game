import type { VisibleEffect } from './assetTypes'

export const rootAssets = {
    fishStick: 'misc-png/INVENTORY_FISHSTICK.webp',
    potion: 'misc-png/INVENTORY_POTION.webp',
    swordShield: 'misc-png/INVENTORY_SWORDSHIELD.webp',
    bread: 'misc-png/ITEM_BREAD.webp',
    fish: 'misc-png/ITEM_FISH.webp',
    copper: 'misc-png/ITEM_COPPER.webp',
    stone: 'misc-png/ITEM_STONE.webp',
    gold: 'misc-png/ITEM_GOLD.webp',
    wood: 'misc-png/ITEM_WOOD.webp',
    gems: 'misc-png/ITEM_GEM.svg',
    swordPiercing: 'effects/piercing.webp',
    overkill: 'misc-png/SKULL_25-0.webp',

    chestBody: 'misc-png/CHEST_BODY.webp',
    chestLid: 'misc-png/CHEST_LID.webp',
    door: 'misc-png/temp-door.webp',
    acceptButton: 'core-ui/newAccept.png',
    endTurnButton: 'core-ui/newEndTurn.png',
    confirmButton: 'core-ui/newConfirm.png',
    skipButton: 'core-ui/newSkip.png',
    closeButton: 'core-ui/closeButton.png',
    leaderboardButton: 'core-ui/leaderboard.png',
    tryAgainButton: 'core-ui/newTryAgain.png',
    abilityButton: 'core-ui/ability pill.svg',
    goButton: 'core-ui/go.webp',
}

export const fontAssets = {
    bigFont: 'root/fonts/Aesthet-Nova/Aesthet-Nova-W05-Black.ttf',
    sansFont: 'root/fonts/Space Grotesk/SpaceGrotesk-VariableFont_wght.ttf',
    monoFont: 'root/fonts/Space Mono/SpaceMono-Bold.ttf',
} as const

// import fort from '@battleAssets/backgrounds/fort-skeleton-temp.jpg'
// import matcha from '@battleAssets/backgrounds/matcha-caves.jpg'
// const ninth = 'backgrounds/ninth-trash-hole.webp'

const caveFinal = 'backgrounds/Matcha_Caves.webp'
export const dungeonBackgroundAssets = {
    'Skelepit Dungeon': caveFinal,
    // 'Hooligans Bluff': caveFinal,
    // 'The Matcha Caves': caveFinal,
    // 'Fort Skeleton': caveFinal,
    // 'The Ninth Trash Hole of Hell': caveFinal,
}

export const entrySceneBackgrounds = {
    skelepitEntrySceneBackground: 'backgrounds/temple_background_4.webp',
}

export const cardArtAssets = {
    cardArtPlaceholder: 'cards/Card PNG Breakdown/Card Art/placeholder.webp',
    cardAttack: 'cards/Card PNG Breakdown/Card Art/basicAttack.webp',
    cardBlock: 'cards/Card PNG Breakdown/Card Art/Basic Block.png',
    cardChainLightning: 'cards/Card PNG Breakdown/Card Art/basicAttack.webp',
    cardDivineIntervention:
        'cards/Card PNG Breakdown/Card Art/divine intervention.png',
    cardGuidingBolt: 'cards/Card PNG Breakdown/Card Art/Guiding Bolt.png',
    cardSpellbook: 'cards/Card PNG Breakdown/Card Art/Spellbook.png',
    cardTestudoFormation:
        'cards/Card PNG Breakdown/Card Art/tetsudo formation.png',

    cardOwnerTokenFrogKnight:
        'cards/Card PNG Breakdown/Card Owner Token/frogKnight.webp',
    cardOwnerTokenMushroomFarmer:
        'cards/Card PNG Breakdown/Card Owner Token/mushroomFarmer.webp',
    cardOwnerTokenNotoriousBean:
        'cards/Card PNG Breakdown/Card Owner Token/notoriousBean.webp',
    cardOwnerTokenPenguinKnight:
        'cards/Card PNG Breakdown/Card Owner Token/penguinKnight.webp',
    cardOwnerTokenSkeletonWarrior:
        'cards/Card PNG Breakdown/Card Owner Token/skeletonWarrior.webp',
    cardOwnerTokenSnacky:
        'cards/Card PNG Breakdown/Card Owner Token/snacky.webp',
    cardOwnerTokenMatchaGelatinCube:
        'cards/Card PNG Breakdown/Card Owner Token/matchaGelatinCube.webp',
    cardOwnerTokenWarhog:
        'cards/Card PNG Breakdown/Card Owner Token/warhog_.webp',
    cardOwnerTokenGnomeHooligan:
        'cards/Card PNG Breakdown/Card Owner Token/gnomeHooligan.webp',
    cardOwnerTokenJerry:
        'cards/Card PNG Breakdown/Card Owner Token/jerry_.webp',

    // cardSweepTheLeg: 'cards/Sweep The Leg.webp',
    // cardShield: 'cards/Shield.webp',
    // cardShieldOfLight: 'cards/Shield of Light.webp',
}

export const cardTypeAssets = {
    cardTypeAttack: 'cards/Card PNG Breakdown/Card Type Decorations/Attack.png',
    cardTypeDefense:
        'cards/Card PNG Breakdown/Card Type Decorations/Defense.png',
    cardTypeEnchantment:
        'cards/Card PNG Breakdown/Card Type Decorations/Enchant.png',
    cardTypeUtility:
        'cards/Card PNG Breakdown/Card Type Decorations/Utility.png',
}

export const cardAssets = {
    remainingEnergy: 'cards/energy flame.webp',
    cardBase: 'cards/Card PNG Breakdown/Card Base.webp',
    cardEnergy: 'cards/Card PNG Breakdown/ManaCostGem.webp',
    cardEnergy0: 'cards/Card PNG Breakdown/Mana Cost Numbers/0.png',
    cardEnergy1: 'cards/Card PNG Breakdown/Mana Cost Numbers/1.png',
    cardEnergy2: 'cards/Card PNG Breakdown/Mana Cost Numbers/2.png',
    cardEnergy3: 'cards/Card PNG Breakdown/Mana Cost Numbers/3.png',
    cardEnergy4: 'cards/Card PNG Breakdown/Mana Cost Numbers/4.png',
    cardEnergy5: 'cards/Card PNG Breakdown/Mana Cost Numbers/5.png',
    cardBackPileSizeOverlay: 'cards/card back pile size overlay.webp',
    drawPile: 'cards/draw.webp',
    discardPile: 'cards/discard.webp',
    draftCard: 'cards/draftCard.webp',
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
//     notoriousBean: 'chars/NotoriousBEAN200.webp',
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
    stanceNeutral: 'stance/neutral stance.webp',
    stanceAvoidant: 'stance/defensive stance.webp',
    stanceAggressive: 'stance/aggressive stance.webp',
    stanceNeutralConfirmed: 'stance/neutral stance confirmed.webp',
    stanceAvoidantConfirmed: 'stance/defensive stance confirmed.webp',
    stanceAggressiveConfirmed: 'stance/aggressive stance confirmed.webp',
    stanceCylinder: 'stance/Stance_Barrel.webp',
    blockIcon: 'char status/block icon.webp',
}
export const effectAssets: {
    [K in VisibleEffect as `effect${Capitalize<K>}`]: string
} = {
    effectBerserkBuff: 'effects/berserk.webp',
    effectBleedDebuff: 'effects/bleed.webp',
    effectBraveBuff: 'effects/brave.webp',
    effectCourageousBuff: 'effects/courageous.webp',
    effectDebilitatedDebuff: 'effects/debilitated.webp',
    effectFatiguedDebuff: 'effects/fatigue.webp',
    effectStrongblockBuff: 'effects/strongblock.webp',
    effectEntrancedBuff: 'effects/magicalStorm.webp',
    effectGuardedBuff: 'effects/strongblock.webp',
    effectPoisonedDebuff: 'effects/poison_skull.webp',
    effectReflectBuff: 'effects/strongblock.webp',
    effectStunnedDebuff: 'effects/stunned.webp',
    effectTiredDebuff: 'effects/tired.webp',
    //TODO: placeholder icon
    effectTargetedDebuff: 'effects/tired.webp',
    effectUnguardedDebuff: 'effects/unguarded.webp',
    effectUnreadyDebuff: 'effects/unready.webp',
    effectVulnerableDebuff: 'effects/vulnerable.webp',
}

export const healthBarAssets = {
    healthBarAggressive: 'health bar/Aggressive Stance.webp',
    healthBarNeutral: 'health bar/Neutral stance.webp',
    healthBarAvoidant: 'health bar/Avoidant stance.webp',
    healthBarDoT: 'health bar/DoT.webp',
    healthBarHealth: 'health bar/Health.webp',
    healthBarBacking: 'health bar/Healthbar Backing.webp',
    healthBarHighlight: 'health bar/Highlight.webp',
    healthBarDamage: 'health bar/Regular Damage.webp',
    healthBarShadow: 'health bar/Shadow.webp',
}

export type IntentAssetKey = keyof typeof intentAssets
export const intentAssets = {
    enemyIntentArrowHead: 'intents/arrow_4_head_bright.webp',
    enemyIntentArrowTail: 'intents/arrow_4_tail_bright.webp',
    intentAttack: 'intents/floating intent amount.webp',
    intentBellyFlop: 'intents/belly button.webp',
    intentRollAround: 'intents/belly button.webp',
    intentMimic: 'intents/Mimic.webp',
    intentInfectiousBite: 'intents/Infectious Bite.webp',
    intentGrudge: 'intents/Grudge.webp',
    intentBlock: 'intents/block.webp',
    intentBuff: 'intents/buff.webp',
    intentDebuff: 'intents/debuff.webp',
    intentBigBomb1: 'intents/gnomeBomb1.webp',
    intentBigBomb2: 'intents/gnomeBomb2.webp',
}

export const orbAssets = {
    orbOfFrost: 'orbs/frost.webp',
    orbOfLightning: 'orbs/lightning.webp',
    orbOfProtection: 'orbs/protection.webp',
    orbOfHolyLight: 'orbs/holyLight.webp',
}

export const signAssets = {
    skelepitDungeonSign: 'signs/skelepit dungeon.webp',
    roomClearedSign: 'signs/newRoomClearedBanner.png',
    draftCardBanner: 'signs/draftCardBanner.png',
    victory: 'signs/victory.png',
    defeat: 'signs/newDefeatBanner.png',
}

export const characterClassAssets = {
    wizardClassIcon: 'character classes/wizard glow.webp',
    knightClassIcon: 'character classes/knight glow.webp',
    clericClassIcon: 'character classes/cleric glow.webp',
    rogueClassIcon: 'character classes/rogue glow.webp',
    bardClassIcon: 'character classes/bard glow.webp',
} as const

export const spineAssets = {
    hooligansBluffHexMapBg: 'spines/scenes/hex map/hooligans bluff/sky.json',

    hooligansBluffBg1_0:
        'spines/scenes/battle/hooligans bluff/HooligansBluffAnimated_Segment_1/KAIJU_BG_Bluffs_Rig_Prep_Segment_1.json',
    hooligansBluffBg1_1:
        'spines/scenes/battle/hooligans bluff/HooligansBluffAnimated_Segment_1/KAIJU_BG_Bluffs_Rig_Prep_Segment_3.json',
    hooligansBluffBg2_0:
        'spines/scenes/battle/hooligans bluff/HooligansBluffAnimated_Segment_2/KAIJU_BG_Bluffs_Rig_Prep_Segment_2.json',
    hooligansBluffBg2_1:
        'spines/scenes/battle/hooligans bluff/HooligansBluffAnimated_Segment_2/KAIJU_BG_Bluffs_Rig_Prep_Segment_3.json',
    hooligansBluffBg3_0:
        'spines/scenes/battle/hooligans bluff/HooligansBluffAnimated_Segment_3/KAIJU_BG_Bluffs_Rig_Prep_Segment_3.json',

    frogKnightSpine: 'spines/characters/frogKnight/FrogKnight.json',
    jerrySpine: 'spines/characters/jerry/Jerry_MJ_Rig_Prep_v4.json',
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
    notoriousBeanSpine:
        'spines/characters/notoriousBean/NotoriousBean_01_SH_09-28-2022.json',
    orcWarriorSpine: 'spines/characters/orcWarriorNPC/Orc_MJ_REF_ONLY.json',
    orcWarriorNPCSpine: 'spines/characters/orcWarriorNPC/Orc_MJ_REF_ONLY.json',
    snackySpine: 'spines/characters/snacky/Snacky_01_SH_09-06-2022.json',

    warhogSkinsSpine: 'spines/characters/warhog/warhog.json',
    warhogSpine: 'SKIN: warhogSkinsSpine -> 0',
    plaguehogSpine: 'SKIN: warhogSkinsSpine -> 1',
    bosshogJurgenSpine: 'SKIN: warhogSkinsSpine -> 2',
    groghogSpine: 'SKIN: warhogSkinsSpine -> 3',
    warhogRaiderSpine: 'SKIN: warhogSkinsSpine -> 4',

    mimicNPCSpine: 'spines/characters/mimicNPC/Mimic.json',

    gnomeSkinsSpine: 'spines/characters/gnomeHooligan/Gnome_Hooligan.json',
    gnomeHooliganSpine: 'SKIN: gnomeSkinsSpine -> 3',
    gnomeProspectorSpine: 'SKIN: gnomeSkinsSpine -> 5',
    gnomeBanditSpine: 'SKIN: gnomeSkinsSpine -> 0',
    gnomeBigBomberSpine: 'SKIN: gnomeSkinsSpine -> 2',

    damageTextSpine: 'spines/damage/Text.json',

    // restSiteSceneSpine: 'spines/scenes/rest site/penguin plush export.json',
    // frogKnightSpineWebp: 'spine/frogKnight/FrogKnight.webp',
    // mushroomFarmerSpineWebp:
    //     'spine/mushroomFarmer/Mushroom_Farmer_MJ_Rig_Prep_v01.webp',
    // skeletonWarriorSpineWebp:
    //     'spine/skeletonWarrior/Skeleton_Warrior_MJ_Rig_Prep_v02.webp',
    // matchaGelatinCubeSpineWebp:
    //     'spine/matchaGelatinCube/Matcha_MJ_Rig_Prep_v04.webp',
} as const

export const scenes = {
    restSiteBg:
        'scenes/rest site/hooligans bluff/plush bg (20221122113046).webp',
    restSiteFrog:
        'scenes/rest site/hooligans bluff/frog plush (20221122112943).png',
    restSiteWarhog:
        'scenes/rest site/hooligans bluff/hog plush (20221122113003).png',
    restSitePenguin:
        'scenes/rest site/hooligans bluff/penguin plush (20221122112928).png',
}

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
    notoriousBeanProfile: 'character profiles/notoriousBean.webp',
    penguinKnightProfile: 'character profiles/penguinKnight.webp',
    skeletonWarriorProfile: 'character profiles/skeletonWarrior.webp',
    snackyProfile: 'character profiles/snacky.webp',
    warhogProfile: 'character profiles/warhog.webp',
}

export const mapAssets = {
    mapRestSite: 'hex map/rest site2.webp',
    mapEventSite: 'hex map/event site.webp',
}

export const mapTileAssets = {
    mapTile1: 'hex map/hooligans bluff/base tile.webp',
    mapTile2: 'hex map/hooligans bluff/base tile.webp',
    mapTile3: 'hex map/hooligans bluff/base tile.webp',
    mapTile4: 'hex map/hooligans bluff/base tile.webp',
    mapTile5: 'hex map/hooligans bluff/base tile.webp',
    mapTile6: 'hex map/hooligans bluff/base tile.webp',
    mapTile7: 'hex map/hooligans bluff/base tile.webp',
    mapTile8: 'hex map/hooligans bluff/base tile.webp',
}

export const userAvatarAssets = {
    userAvatar1: 'user/profilePic/pixelated1.svg',
    userAvatar2: 'user/profilePic/pixelated2.svg',
    userAvatar3: 'user/profilePic/pixelated3.svg',
    userAvatar4: 'user/profilePic/pixelated4.svg',
    userAvatar5: 'user/profilePic/pixelated5.svg',
    userAvatar6: 'user/profilePic/pixelated6.svg',
    userAvatar7: 'user/profilePic/pixelated7.svg',
    userAvatar8: 'user/profilePic/pixelated8.svg',
    userAvatar9: 'user/profilePic/pixelated9.svg',
    userAvatar10: 'user/profilePic/pixelated10.svg',
}

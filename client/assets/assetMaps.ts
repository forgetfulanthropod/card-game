import { SouvenirId } from 'shared'
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
    killConfirmed: 'misc-png/killConfirmed.png',
    crossedSwords: 'misc-png/crossedSwordsAlpha.png',

    chestBody: 'misc-png/CHEST_BODY.webp',
    chestLid: 'misc-png/CHEST_LID.webp',
    door: 'misc-png/temp-door.webp',
    acceptButton: 'core-ui/newAccept.png',
    endTurnButton: 'core-ui/endTurn.png',
    confirmButton: 'core-ui/confirm.png',
    skipButton: 'core-ui/skip.png',
    closeButton: 'core-ui/xButton.png',
    leaderboardButton: 'core-ui/viewLeaderboard.png',
    tryAgainButton: 'core-ui/tryAgain.png',
    abilityButton: 'core-ui/ability pill.svg',
    goButton: 'core-ui/go.webp',
    leftArrow: 'core-ui/leftArrow.png',
    rightArrow: 'core-ui/rightArrow.png',
    upArrow: 'core-ui/upArrow.png',
    upArrowSimple: 'core-ui/upArrowSimple.png',
    downArrow: 'core-ui/downArrow.png',

    // targetingArrow: 'core-ui/targetingArrow.webp',
    targetingArrowAttack: 'core-ui/targetingArrowAttack.webp',
    targetingArrowDefense: 'core-ui/targetingArrowDefense.webp',
    targetingArrowUtility: 'core-ui/targetingArrowUtility.webp',
    targetingArrowEnchantment: 'core-ui/targetingArrowEnchantment.webp',
    // targetingBead: 'core-ui/targetingBead.webp',
    targetingBeadAttack: 'core-ui/targetingBeadAttack.webp',
    targetingBeadDefense: 'core-ui/targetingBeadDefense.webp',
    targetingBeadUtility: 'core-ui/targetingBeadUtility.webp',
    targetingBeadEnchantment: 'core-ui/targetingBeadEnchantment.webp',
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
    cardBlock: 'cards/Card PNG Breakdown/Card Art/Basic Block.webp',
    cardChainLightning: 'cards/Card PNG Breakdown/Card Art/basicAttack.webp',
    cardDivineIntervention:
        'cards/Card PNG Breakdown/Card Art/divine intervention.png',
    cardGuidingBolt: 'cards/Card PNG Breakdown/Card Art/Guiding Bolt.png',
    cardPatientAmbush: 'cards/Card PNG Breakdown/Card Art/patient ambush.png',
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
    statAttack: 'core-ui/stats/Attack.webp',
    statMagic: 'core-ui/stats/Magic.webp',
    statDefense: 'core-ui/stats/Defense.webp',
    statConstitution: 'core-ui/stats/Constitution.webp',

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
    effectGuardedBuff: 'effects/guarded.webp',
    effectPoisonedDebuff: 'effects/poison_skull.webp',
    effectReflectBuff: 'effects/reflect.webp',
    effectStunnedDebuff: 'effects/stunned.webp',
    effectTiredDebuff: 'effects/tired.webp',
    effectStampBuff: 'effects/stamp_and_snort.webp',
    //TODO: placeholder icon
    effectChargedBombBuff: 'intents/gnomeBomb1.webp',
    effectTargetedDebuff: 'effects/tired.webp',
    effectUnguardedDebuff: 'effects/unguarded.webp',
    effectUnreadyDebuff: 'effects/unready.webp',
    effectVulnerableDebuff: 'effects/vulnerable.webp',
    effectFireDebuff: 'intents/fire_.webp',
    effectValiant: 'char status/valiant.webp',
    effectArcaneConnection: 'char status/arcaneConnection.webp',
    effectAnHonestLiving: 'char status/anHonestLiving.webp',
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
    intentAttack: 'intents/floating intent amount_.webp',
    intentBellyFlop: 'intents/belly button_.webp',
    intentRollAround: 'intents/big_belly_.webp',
    intentBellowAndSing: 'intents/bellow_and_sing_.webp',
    intentBucketOfBangSnaps: 'intents/bucket_of_bang_snaps_.webp',
    intentBrimbone: 'intents/brimbone_.webp',
    intentDemolitionCharge: 'intents/demolition_charge_.webp',
    intentFire: 'intents/fire_.webp',
    intentMimic: 'intents/mimic_.webp',
    intentInfectiousBite: 'intents/infectious_bite_.webp',
    intentGrudge: 'intents/grudge_.webp',
    intentHypnosis: 'intents/hypnosis_.webp',
    intentBlock: 'intents/block_.webp',
    intentBuff: 'intents/buff_.webp',
    intentDebuff: 'intents/debuff_.webp',
    intentBigBomb1: 'intents/gnomeBomb1_.webp',
    intentBigBomb2: 'intents/gnomeBomb2_.webp',
    intentMeatyCharge: 'intents/meaty_charge_.webp',
    intentRoadClosure: 'intents/road_closure_.webp',
    intentSnowFort: 'intents/snow_fort_.webp',
    intentCommonCold: 'intents/common_cold_.webp',
    intentFireCracker: 'intents/fire_cracker_.webp',
    intentScreamAndStomp: 'intents/scream_and_stomp_.webp',
    intentSnortinTime: 'intents/snortin_time_.webp',
    intentYodel: 'intents/yodel_.webp',
    intentSnout: 'intents/snout_.webp',
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
    leaderboardBanner: 'signs/leaderboardBanner.png',
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
    skeletonWarriorSkinsSpine:
        'spines/characters/skeletonWarrior/Skeleton Warrior.json',
    skeletonWarriorSpine: 'SKIN: skeletonWarriorSkinsSpine -> 0',
    skeletonWarriorNPCSpine: 'SKIN: skeletonWarriorSkinsSpine -> 1',
    brimboneSkeletonSpine: 'SKIN: skeletonWarriorSkinsSpine -> 2',
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
    frostHogSpine: 'SKIN: warhogSkinsSpine -> 5',

    frogKnightGenOneSpine: 'spines/characters/frogGenOne/FrogKnight.json',
    penguinKnightGenOneSpine: 'spines/characters/penguinGenOne/imported.json',
    warhogGenOneSpine: 'spines/characters/warhogGenOne/default.json',

    mimicSkinsSpine: 'spines/characters/mimicNPC/Mimic.json',
    mimicNPCSpine: 'SKIN: mimicSkinsSpine -> 1',

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
    hooligansBluffLogo: 'hex map/hooligans bluff/hooligansBluffLogo.png',
    mapRestSite: 'hex map/rest site2.webp',
    mapEventSite: 'hex map/event site.webp',
    tierOneIcon: 'hex map/tierOneIcon.webp',
    tierTwoIcon: 'hex map/tierTwoIcon.webp',
    tierThreeIcon: 'hex map/tierThreeIcon.webp',
    tierFourIcon: 'hex map/tierFourIcon.webp',
}

export const mapTileAssets = {
    mapTileBase: 'hex map/hooligans bluff/base tile.webp',
    mapTileBoss: 'hex map/hooligans bluff/bossTile.png',
    mapTileTopG_1:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_1.webp',
    mapTileTopG_2:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_2.webp',
    mapTileTopG_3:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_3.webp',
    mapTileTopG_4:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_4.webp',
    mapTileTopG_5:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_5.webp',
    mapTileTopG_6:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_6.webp',
    mapTileTopG_7:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_7.webp',
    mapTileTopG_8:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_8.webp',
    mapTileTopG_9:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_9.webp',
    mapTileTopG_10:
        'hex map/hooligans bluff/Top of Tile Decorations/(Layer 01) Grass/Grass_10.webp',
    mapTileTop1_1:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/1.webp',
    mapTileTop1_2:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/2.webp',
    mapTileTop1_3:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/3.webp',
    mapTileTop1_4:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/4.webp',
    mapTileTop1_5:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/5.webp',
    mapTileTop1_6:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/6.webp',
    mapTileTop1_7:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/7.webp',
    mapTileTop1_8:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/8.webp',
    mapTileTop1_9:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 1/9.webp',
    mapTileTop2_1:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/1.webp',
    mapTileTop2_2:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/2.webp',
    mapTileTop2_3:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/3.webp',
    mapTileTop2_4:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/4.webp',
    mapTileTop2_5:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/5.webp',
    mapTileTop2_6:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/6.webp',
    mapTileTop2_7:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/7.webp',
    mapTileTop2_8:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/8.webp',
    mapTileTop3_1:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/1.webp',
    mapTileTop3_2:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/2.webp',
    mapTileTop3_3:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/3.webp',
    mapTileTop3_4:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/4.webp',
    mapTileTop3_5:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/5.webp',
    mapTileTop3_6:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/6.webp',
    mapTileTop3_7:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/7.webp',
    mapTileTop3_8:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 2/8.webp',
    mapTileTop4_1:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 4/1.webp',
    mapTileTop4_2:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 4/2.webp',
    mapTileTop4_3:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 4/3.webp',
    mapTileTop4_4:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 4/4.webp',
    mapTileTop5_1:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/1.webp',
    mapTileTop5_2:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/2.webp',
    mapTileTop5_3:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/3.webp',
    mapTileTop5_4:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/4.webp',
    mapTileTop5_5:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/5.webp',
    mapTileTop5_6:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/6.webp',
    mapTileTop5_7:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/7.webp',
    mapTileTop5_8:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 5/8.webp',
    mapTileTop6_1:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/1.webp',
    mapTileTop6_2:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/2.webp',
    mapTileTop6_3:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/3.webp',
    mapTileTop6_4:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/4.webp',
    mapTileTop6_5:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/5.webp',
    mapTileTop6_6:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/6.webp',
    mapTileTop6_7:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/7.webp',
    mapTileTop6_8:
        'hex map/hooligans bluff/Top of Tile Decorations/Doodad Slot 6/8.webp',
    mapTileBottom1_1__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_1_(5).webp',
    mapTileBottom1_2__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_2_(5).webp',
    mapTileBottom1_3__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_3_(5).webp',
    mapTileBottom1_4__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_4_(5).webp',
    mapTileBottom1_5__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_5_(5).webp',
    mapTileBottom1_6__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_6_(5).webp',
    mapTileBottom1_7__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_7_(5).webp',
    mapTileBottom1_8__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_8_(5).webp',
    mapTileBottom1_9__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_9_(5).webp',
    mapTileBottom1_10__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_10_(5).webp',
    mapTileBottom1_11__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_11_(5).webp',
    mapTileBottom1_12__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_12_(5).webp',
    mapTileBottom1_13__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_13_(5).webp',
    mapTileBottom1_14__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_14_(5).webp',
    mapTileBottom1_15__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_15_(5).webp',
    mapTileBottom1_16__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_16_(5).webp',
    mapTileBottom1_17__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_17_(5).webp',
    mapTileBottom1_18__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_18_(5).webp',
    mapTileBottom1_19__5:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 01) Cracks/Crack_19_(5).webp',
    mapTileBottom2_1__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_1_(7).webp',
    mapTileBottom2_2__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_2_(7).webp',
    mapTileBottom2_3__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_3_(7).webp',
    mapTileBottom2_4__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_4_(7).webp',
    mapTileBottom2_5__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_5_(7).webp',
    mapTileBottom2_6__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_6_(7).webp',
    mapTileBottom2_7__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_7_(7).webp',
    mapTileBottom2_8__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_8_(7).webp',
    mapTileBottom2_9__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 02) Flat Rocks/Flat_Rocks_9_(7).webp',
    mapTileBottom3_1_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_1_(10).webp',
    mapTileBottom3_2_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_2_(10).webp',
    mapTileBottom3_3_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_3_(10).webp',
    mapTileBottom3_4_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_4_(10).webp',
    mapTileBottom3_5_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_5_(10).webp',
    mapTileBottom3_6_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_6_(10).webp',
    mapTileBottom3_7_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_7_(10).webp',
    mapTileBottom3_8_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_8_(10).webp',
    mapTileBottom3_9_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_9_(10).webp',
    mapTileBottom3_10_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_10_(10).webp',
    mapTileBottom3_11_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_11_(10).webp',
    mapTileBottom3_12_1_0:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 03) Little Rocks/Little_Rocks_12_(10).webp',
    mapTileBottom4_1__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_1_(7).webp',
    mapTileBottom4_2__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_2_(7).webp',
    mapTileBottom4_3__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_3_(7).webp',
    mapTileBottom4_4__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_4_(7).webp',
    mapTileBottom4_5__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_5_(7).webp',
    mapTileBottom4_6__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_6_(7).webp',
    mapTileBottom4_7__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_7_(7).webp',
    mapTileBottom4_8__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_8_(7).webp',
    mapTileBottom4_9__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_9_(7).webp',
    mapTileBottom4_10__7:
        'hex map/hooligans bluff/Bottom of Tile Decorations/(Layer 04) Crystals/Crystals_10_(7).webp',
    mapTilePathroot: 'hex map/hooligans bluff/paths/root.png',
    mapTilePath3: 'hex map/hooligans bluff/paths/3.png',
    mapTilePath13: 'hex map/hooligans bluff/paths/13.png',
    mapTilePath03: 'hex map/hooligans bluff/paths/03.png',
    mapTilePath04: 'hex map/hooligans bluff/paths/04.png',
    mapTilePath013: 'hex map/hooligans bluff/paths/013.png',
    mapTilePath14: 'hex map/hooligans bluff/paths/14.png',
    mapTilePath014: 'hex map/hooligans bluff/paths/014.png',
    mapTilePath15: 'hex map/hooligans bluff/paths/15.png',
    mapTilePath24: 'hex map/hooligans bluff/paths/24.png',
    mapTilePath024: 'hex map/hooligans bluff/paths/024.png',
    mapTilePath25: 'hex map/hooligans bluff/paths/25.png',
    mapTilePath034: 'hex map/hooligans bluff/paths/034.png',
    mapTilePath124: 'hex map/hooligans bluff/paths/124.png',
    mapTilePath0134: 'hex map/hooligans bluff/paths/0134.png',
    mapTilePath135: 'hex map/hooligans bluff/paths/135.png',

    mapBargainBin: 'souvenirs/temp bargain bin.webp',
}

export type EventAssetKey = keyof typeof eventAssets

export const eventAssets = {
    // eventGradient: 'events/Event Overlay.webp',
    eventFrame: 'events/event frame.svg',
    eventBanner: 'events/banner.svg',
    eventGraphicBackdrop: 'events/event graphic backdrop.svg',
    eventChoiceButton1: 'events/event button 1.svg',
    eventChoiceButton2: 'events/event button 2.svg',
    eventChoiceButton3: 'events/event button 3.svg',

    eventFrogCarriageMainGraphic:
        'events/main graphics/FrogCarriage Image.webp',
    eventCursedStatueMainGraphic: 'events/main graphics/Cursed Statue.webp',
    eventGnomeStoryMainGraphic: 'events/main graphics/Gnome Story.webp',
    eventGnomeToothMainGraphic: 'events/main graphics/GnomeTooth.webp',
    eventHogClownMainGraphic:
        'events/main graphics/Hog Covered in Clowns_.webp',
    eventTooManyHatsMainGraphic: 'events/main graphics/Too Many Hats.webp',
}
export type SouvenirAssetKey = keyof typeof souvenirAssets
export const souvenirAssets: {
    [K in SouvenirId as `souvenir${Capitalize<K>}`]: string
} = {
    //@ts-expect-error
    souvenirPlaceholder: 'souvenirs/souvenirPlaceholder.webp',
    souvenirBigStinkyTooth: 'souvenirs/Stinky Tooth.webp',
    souvenirBrokenCarriageWheel: 'souvenirs/Broken Carriage Wheel.webp',
    souvenirBundleOfFrogWine: 'souvenirs/Bundle Of frog Wine.webp',
    souvenirClownInfestation: 'souvenirs/Clown Infestation.webp',
    souvenirCowardsCrown: 'souvenirs/Cowards Crown.webp',
    souvenirDemonsLeftHand: "souvenirs/Demon's Left Hand.webp",
    souvenirDemonsRightHand: "souvenirs/Demon's Right Hand.webp",
    souvenirDentistryForDummies: 'souvenirs/Dentistry for dummies.webp',
    souvenirFrogWine: 'souvenirs/barrel of frog wine.webp',
    souvenirGlassOfWarmMilk: 'souvenirs/Glass of Warm Milk.webp',
    souvenirNightmareBiscuit: 'souvenirs/Nightmare Biscuit.webp',
    souvenirSqueakyClownShoes: 'souvenirs/Squeaky clown shoes.webp',

    souvenirYummyRice: 'souvenirs/Yummy rice.webp',
    souvenirAdvilPM: 'souvenirs/Advil PM.webp',
    souvenirAllPurposeKnob: 'souvenirs/Silver Doorknob.webp',
    // souvenir: |souvenirs/ | 'beanInAJar.webp',
    souvenirBigSniff: 'souvenirs/Big Sniffa.webp',
    souvenirBootlegExplosive: 'souvenirs/Bootleg Explosive.webp',
    souvenirConcreteShoes: 'souvenirs/Concrete Shoes.webp',
    souvenirContaminatedRag: 'souvenirs/contaminated rag.webp',
    souvenirDearestDiary: 'souvenirs/Dearest Diary.webp',
    souvenirDemonCookie: 'souvenirs/Nightmare Biscuit.webp',
    souvenirDietaryYogurt: 'souvenirs/Dietary Yogurt.webp',
    souvenirEmptyDiaper: 'souvenirs/Empty Daip.webp',
    souvenirEnchantedSnowball: 'souvenirs/Enchanted snowball.webp',
    souvenirFamilyBeetle: 'souvenirs/Family Beetle.webp',
    souvenirFilledDiaper: 'souvenirs/Filled Diaper.webp',
    souvenirGamerBathwater: 'souvenirs/Gamer bathwater.webp',
    souvenirLacedBathSalts: 'souvenirs/Laced Bath Salts.webp',
    souvenirLavenderTea: 'souvenirs/Lavender tea.webp',
    souvenirLilFella: 'souvenirs/Lil Fella.webp',
    // souvenirLilTaste: "souvenirs/Lil' Taste.webp",
    // souvenir: |souvenirs/ | 'mommysCreditCard.webp',
    souvenirOrganicBathSalts: 'souvenirs/Organic Bath Salts.webp',
    souvenirPenguinEgg: 'souvenirs/Penguin egg.webp',
    souvenirPetRock: 'souvenirs/Pet Rock.webp',
    souvenirPulledRug: 'souvenirs/Pulled rug.webp',
    souvenirQuestionableHat: 'souvenirs/Questionable Hat_.webp',
    souvenirRestrainingOrder: 'souvenirs/Restraining order.webp',
    souvenirRustedGear: 'souvenirs/Rusted Gear.webp',
    souvenirGrandmasHandbag: "souvenirs/Grandma's Handbag.webp",
    souvenirShinyMarble: 'souvenirs/Shiny Marble.webp',
    souvenirSilkGloves: 'souvenirs/Silk Gloves.webp',
    souvenirSquireEmblem: 'souvenirs/Squire Emblem.webp',
    souvenirStinkEgg: 'souvenirs/Stinky Egg!.webp',
    souvenirStinkyMeat: 'souvenirs/Stinky meat.webp',
    souvenirStinkySandwich: 'souvenirs/Stinky Sandwich.webp',
    souvenirStrangeHat: 'souvenirs/Strange hat.webp',
    souvenirWoolBandana: 'souvenirs/Wool Bandana.webp',
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

export type SoundAssetKey = SoundEffectAssetKey | MusicAssetKey

export type SoundEffectAssetKey = keyof typeof soundEffectAssets

export const soundEffectAssets = {
    musicDefeat: 'sfx/Defeat.mp3',

    soundNotEnoughEnergy: 'sfx/not enough energy.mp3',
    soundBlock: 'sfx/block.mp3',
    soundDraw: 'sfx/Card_draw_2.mp3',
    soundHighlight: 'sfx/Card_highlight_2.mp3',

    soundGenericTakingDamage: 'sfx/Card_highlight_2.mp3',

    soundFrogKnightAttack: 'sfx/Frog Knight Attack.mp3',
    soundFrogKnightTakingDamage: 'sfx/Frog Knight Taking Damage.mp3',
    soundMushroomFarmerAttack: 'sfx/Mushroom Farmer Attack.mp3',
    soundMushroomFarmerTakingDamage: 'sfx/Mushroom Farmer Taking Damage.mp3',
    soundPenguinKnightAttack: 'sfx/Penguin Knight Attack.mp3',
    soundPenguinKnightTakingDamage: 'sfx/Penguin Knight Taking Damage.mp3',
    soundSkeletonWarriorAttack: 'sfx/Skeleton Warrior Attack.mp3',
    soundSkeletonWarriorTakingDamage: 'sfx/Skeleton Warrior Taking Damage.mp3',
    soundMatchaGelatinCubeAttack: 'sfx/Matcha Attack v2.mp3',
    soundMatchaGelatinCubeTakingDamage: 'sfx/Matcha Taking Damage v2.mp3',
    soundWarhogAttack: 'sfx/Warhog Attack.mp3',
    soundWarhogTakingDamage: 'sfx/Warhog Taking Damage.mp3',
    soundGnomeHooliganAttack: 'sfx/Gnome Hooligan Attack.mp3',
    soundGnomeHooliganTakingDamage: 'sfx/Gnome Hooligan Taking Damage.mp3',
    soundJerryAttack: 'sfx/Jerry Attack.mp3',
    soundJerryTakingDamage: 'sfx/Jerry Taking Damage.mp3',
}

export const videoAssets = {
    // mapBg: 'hex map/dungeon test bg for export.mp4',
}

export type MusicAssetKey = keyof typeof musicAssets

export const musicAssets = {
    entrySceneMusicHooligansBluff:
        'music/Main Theme Variants/character_select.mp3',
    hexMapMusicHooligansBluff: 'music/Main Theme Variants/map_1.mp3',
    battleMusicHooligansBluffTierOne:
        'music/Main Theme Variants/hooligans_bluff_combat->tierOne.mp3',
    battleMusicHooligansBluffTierTwo:
        'music/Main Theme Variants/hooligans_bluff_combat->tierTwo.mp3',
    battleMusicHooligansBluffTierThreeAndFour:
        'music/Main Theme Variants/hooligans_bluff_combat->tierThreeAndFour.mp3',
    bossBattleMusicHooligansBluff: 'music/Main Theme Variants/boss_battle.mp3',
    roomVictoryMusicHooligansBluff: 'music/Room_Victory.mp3',
    defeatMusicHooligansBluff: 'music/defeat song_v1.mp3',
    runVictoryMusicHooligansBluff: 'music/entire_run_victory_song_v1.mp3',
}

export const sequences = {
    // @index(['../../public/assets/fx sequences/**/*.webp'], f => `${f.name}: '${f.path.replace('../../public/assets/', '')}.webp',`)
    // KC_FX_AdvAttack_121222_0001:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0001.webp',
    // KC_FX_AdvAttack_121222_0002:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0002.webp',
    // KC_FX_AdvAttack_121222_0003:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0003.webp',
    // KC_FX_AdvAttack_121222_0004:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0004.webp',
    // KC_FX_AdvAttack_121222_0005:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0005.webp',
    // KC_FX_AdvAttack_121222_0006:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0006.webp',
    // KC_FX_AdvAttack_121222_0007:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0007.webp',
    // KC_FX_AdvAttack_121222_0008:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0008.webp',
    // KC_FX_AdvAttack_121222_0009:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0009.webp',
    // KC_FX_AdvAttack_121222_0010:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0010.webp',
    // KC_FX_AdvAttack_121222_0011:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0011.webp',
    // KC_FX_AdvAttack_121222_0012:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0012.webp',
    // KC_FX_AdvAttack_121222_0013:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0013.webp',
    // KC_FX_AdvAttack_121222_0014:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0014.webp',
    // KC_FX_AdvAttack_121222_0015:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0015.webp',
    // KC_FX_AdvAttack_121222_0016:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0016.webp',
    // KC_FX_AdvAttack_121222_0017:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0017.webp',
    // KC_FX_AdvAttack_121222_0018:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0018.webp',
    // KC_FX_AdvAttack_121222_0019:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0019.webp',
    // KC_FX_AdvAttack_121222_0020:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0020.webp',
    // KC_FX_AdvAttack_121222_0021:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0021.webp',
    // KC_FX_AdvAttack_121222_0022:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0022.webp',
    // KC_FX_AdvAttack_121222_0023:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0023.webp',
    // KC_FX_AdvAttack_121222_0024:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0024.webp',
    // KC_FX_AdvAttack_121222_0025:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0025.webp',
    // KC_FX_AdvAttack_121222_0026:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0026.webp',
    // KC_FX_AdvAttack_121222_0027:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0027.webp',
    // KC_FX_AdvAttack_121222_0028:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0028.webp',
    // KC_FX_AdvAttack_121222_0029:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0029.webp',
    // KC_FX_AdvAttack_121222_0030:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0030.webp',
    // KC_FX_AdvAttack_121222_0031:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0031.webp',
    // KC_FX_AdvAttack_121222_0032:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0032.webp',
    // KC_FX_AdvAttack_121222_0033:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0033.webp',
    // KC_FX_AdvAttack_121222_0034:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0034.webp',
    // KC_FX_AdvAttack_121222_0035:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0035.webp',
    // KC_FX_AdvAttack_121222_0036:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0036.webp',
    // KC_FX_AdvAttack_121222_0037:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0037.webp',
    // KC_FX_AdvAttack_121222_0038:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0038.webp',
    // KC_FX_AdvAttack_121222_0039:
    //     'fx sequences/AdvAttack/KC_FX_AdvAttack_121222_0039.webp',
    KC_FX_BasicAttack_121222_0001:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0001.webp',
    KC_FX_BasicAttack_121222_0002:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0002.webp',
    KC_FX_BasicAttack_121222_0003:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0003.webp',
    KC_FX_BasicAttack_121222_0004:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0004.webp',
    KC_FX_BasicAttack_121222_0005:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0005.webp',
    KC_FX_BasicAttack_121222_0006:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0006.webp',
    KC_FX_BasicAttack_121222_0007:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0007.webp',
    KC_FX_BasicAttack_121222_0008:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0008.webp',
    KC_FX_BasicAttack_121222_0009:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0009.webp',
    KC_FX_BasicAttack_121222_0010:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0010.webp',
    KC_FX_BasicAttack_121222_0011:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0011.webp',
    KC_FX_BasicAttack_121222_0012:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0012.webp',
    KC_FX_BasicAttack_121222_0013:
        'fx sequences/BasicAttack/KC_FX_BasicAttack_121222_0013.webp',
    KC_FX_Bleed_121222_0001: 'fx sequences/Bleed/KC_FX_Bleed_121222_0001.webp',
    KC_FX_Bleed_121222_0002: 'fx sequences/Bleed/KC_FX_Bleed_121222_0002.webp',
    KC_FX_Bleed_121222_0003: 'fx sequences/Bleed/KC_FX_Bleed_121222_0003.webp',
    KC_FX_Bleed_121222_0004: 'fx sequences/Bleed/KC_FX_Bleed_121222_0004.webp',
    KC_FX_Bleed_121222_0005: 'fx sequences/Bleed/KC_FX_Bleed_121222_0005.webp',
    KC_FX_Bleed_121222_0006: 'fx sequences/Bleed/KC_FX_Bleed_121222_0006.webp',
    KC_FX_Bleed_121222_0007: 'fx sequences/Bleed/KC_FX_Bleed_121222_0007.webp',
    KC_FX_Bleed_121222_0008: 'fx sequences/Bleed/KC_FX_Bleed_121222_0008.webp',
    KC_FX_Bleed_121222_0009: 'fx sequences/Bleed/KC_FX_Bleed_121222_0009.webp',
    KC_FX_Bleed_121222_0010: 'fx sequences/Bleed/KC_FX_Bleed_121222_0010.webp',
    KC_FX_Bleed_121222_0011: 'fx sequences/Bleed/KC_FX_Bleed_121222_0011.webp',
    KC_FX_Bleed_121222_0012: 'fx sequences/Bleed/KC_FX_Bleed_121222_0012.webp',
    KC_FX_Bleed_121222_0013: 'fx sequences/Bleed/KC_FX_Bleed_121222_0013.webp',
    KC_FX_Bleed_121222_0014: 'fx sequences/Bleed/KC_FX_Bleed_121222_0014.webp',
    KC_FX_Bleed_121222_0015: 'fx sequences/Bleed/KC_FX_Bleed_121222_0015.webp',
    KC_FX_Bleed_121222_0016: 'fx sequences/Bleed/KC_FX_Bleed_121222_0016.webp',
    KC_FX_Bleed_121222_0017: 'fx sequences/Bleed/KC_FX_Bleed_121222_0017.webp',
    KC_FX_Bleed_121222_0018: 'fx sequences/Bleed/KC_FX_Bleed_121222_0018.webp',
    KC_FX_Bleed_121222_0019: 'fx sequences/Bleed/KC_FX_Bleed_121222_0019.webp',
    KC_FX_Bleed_121222_0020: 'fx sequences/Bleed/KC_FX_Bleed_121222_0020.webp',
    KC_FX_Bleed_121222_0021: 'fx sequences/Bleed/KC_FX_Bleed_121222_0021.webp',
    KC_FX_Bleed_121222_0022: 'fx sequences/Bleed/KC_FX_Bleed_121222_0022.webp',
    KC_FX_BlockBreak_121222_0001:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0001.webp',
    KC_FX_BlockBreak_121222_0002:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0002.webp',
    KC_FX_BlockBreak_121222_0003:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0003.webp',
    KC_FX_BlockBreak_121222_0004:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0004.webp',
    KC_FX_BlockBreak_121222_0005:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0005.webp',
    KC_FX_BlockBreak_121222_0006:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0006.webp',
    KC_FX_BlockBreak_121222_0007:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0007.webp',
    KC_FX_BlockBreak_121222_0008:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0008.webp',
    KC_FX_BlockBreak_121222_0009:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0009.webp',
    KC_FX_BlockBreak_121222_0010:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0010.webp',
    KC_FX_BlockBreak_121222_0011:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0011.webp',
    KC_FX_BlockBreak_121222_0012:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0012.webp',
    KC_FX_BlockBreak_121222_0013:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0013.webp',
    KC_FX_BlockBreak_121222_0014:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0014.webp',
    KC_FX_BlockBreak_121222_0015:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0015.webp',
    KC_FX_BlockBreak_121222_0016:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0016.webp',
    KC_FX_BlockBreak_121222_0017:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0017.webp',
    KC_FX_BlockBreak_121222_0018:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0018.webp',
    KC_FX_BlockBreak_121222_0019:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0019.webp',
    KC_FX_BlockBreak_121222_0020:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0020.webp',
    KC_FX_BlockBreak_121222_0021:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0021.webp',
    KC_FX_BlockBreak_121222_0022:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0022.webp',
    KC_FX_BlockBreak_121222_0023:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0023.webp',
    KC_FX_BlockBreak_121222_0024:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0024.webp',
    KC_FX_BlockBreak_121222_0025:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0025.webp',
    KC_FX_BlockBreak_121222_0026:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0026.webp',
    KC_FX_BlockBreak_121222_0027:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0027.webp',
    KC_FX_BlockBreak_121222_0028:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0028.webp',
    KC_FX_BlockBreak_121222_0029:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0029.webp',
    KC_FX_BlockBreak_121222_0030:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0030.webp',
    KC_FX_BlockBreak_121222_0031:
        'fx sequences/BlockBreak/KC_FX_BlockBreak_121222_0031.webp',
    // KC_FX_BlockBreakShort_121222_0001:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0001.webp',
    // KC_FX_BlockBreakShort_121222_0002:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0002.webp',
    // KC_FX_BlockBreakShort_121222_0003:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0003.webp',
    // KC_FX_BlockBreakShort_121222_0004:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0004.webp',
    // KC_FX_BlockBreakShort_121222_0005:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0005.webp',
    // KC_FX_BlockBreakShort_121222_0006:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0006.webp',
    // KC_FX_BlockBreakShort_121222_0007:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0007.webp',
    // KC_FX_BlockBreakShort_121222_0008:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0008.webp',
    // KC_FX_BlockBreakShort_121222_0009:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0009.webp',
    // KC_FX_BlockBreakShort_121222_0010:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0010.webp',
    // KC_FX_BlockBreakShort_121222_0011:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0011.webp',
    // KC_FX_BlockBreakShort_121222_0012:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0012.webp',
    // KC_FX_BlockBreakShort_121222_0013:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0013.webp',
    // KC_FX_BlockBreakShort_121222_0014:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0014.webp',
    // KC_FX_BlockBreakShort_121222_0015:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0015.webp',
    // KC_FX_BlockBreakShort_121222_0016:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0016.webp',
    // KC_FX_BlockBreakShort_121222_0017:
    //     'fx sequences/BlockBreakShort/KC_FX_BlockBreakShort_121222_0017.webp',
    // KC_FX_GainEnergy_121222_0001:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0001.webp',
    // KC_FX_GainEnergy_121222_0002:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0002.webp',
    // KC_FX_GainEnergy_121222_0003:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0003.webp',
    // KC_FX_GainEnergy_121222_0004:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0004.webp',
    // KC_FX_GainEnergy_121222_0005:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0005.webp',
    // KC_FX_GainEnergy_121222_0006:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0006.webp',
    // KC_FX_GainEnergy_121222_0007:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0007.webp',
    // KC_FX_GainEnergy_121222_0008:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0008.webp',
    // KC_FX_GainEnergy_121222_0009:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0009.webp',
    // KC_FX_GainEnergy_121222_0010:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0010.webp',
    // KC_FX_GainEnergy_121222_0011:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0011.webp',
    // KC_FX_GainEnergy_121222_0012:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0012.webp',
    // KC_FX_GainEnergy_121222_0013:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0013.webp',
    // KC_FX_GainEnergy_121222_0014:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0014.webp',
    // KC_FX_GainEnergy_121222_0015:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0015.webp',
    // KC_FX_GainEnergy_121222_0016:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0016.webp',
    // KC_FX_GainEnergy_121222_0017:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0017.webp',
    // KC_FX_GainEnergy_121222_0018:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0018.webp',
    // KC_FX_GainEnergy_121222_0019:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0019.webp',
    // KC_FX_GainEnergy_121222_0020:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0020.webp',
    // KC_FX_GainEnergy_121222_0021:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0021.webp',
    // KC_FX_GainEnergy_121222_0022:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0022.webp',
    // KC_FX_GainEnergy_121222_0023:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0023.webp',
    // KC_FX_GainEnergy_121222_0024:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0024.webp',
    // KC_FX_GainEnergy_121222_0025:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0025.webp',
    // KC_FX_GainEnergy_121222_0026:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0026.webp',
    // KC_FX_GainEnergy_121222_0027:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0027.webp',
    // KC_FX_GainEnergy_121222_0028:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0028.webp',
    // KC_FX_GainEnergy_121222_0029:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0029.webp',
    // KC_FX_GainEnergy_121222_0030:
    //     'fx sequences/GainEnergy/KC_FX_GainEnergy_121222_0030.webp',
    KC_FX_GainHealth_121222_0001:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0001.webp',
    KC_FX_GainHealth_121222_0002:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0002.webp',
    KC_FX_GainHealth_121222_0003:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0003.webp',
    KC_FX_GainHealth_121222_0004:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0004.webp',
    KC_FX_GainHealth_121222_0005:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0005.webp',
    KC_FX_GainHealth_121222_0006:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0006.webp',
    KC_FX_GainHealth_121222_0007:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0007.webp',
    KC_FX_GainHealth_121222_0008:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0008.webp',
    KC_FX_GainHealth_121222_0009:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0009.webp',
    KC_FX_GainHealth_121222_0010:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0010.webp',
    KC_FX_GainHealth_121222_0011:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0011.webp',
    KC_FX_GainHealth_121222_0012:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0012.webp',
    KC_FX_GainHealth_121222_0013:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0013.webp',
    KC_FX_GainHealth_121222_0014:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0014.webp',
    KC_FX_GainHealth_121222_0015:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0015.webp',
    KC_FX_GainHealth_121222_0016:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0016.webp',
    KC_FX_GainHealth_121222_0017:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0017.webp',
    KC_FX_GainHealth_121222_0018:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0018.webp',
    KC_FX_GainHealth_121222_0019:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0019.webp',
    KC_FX_GainHealth_121222_0020:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0020.webp',
    KC_FX_GainHealth_121222_0021:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0021.webp',
    KC_FX_GainHealth_121222_0022:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0022.webp',
    KC_FX_GainHealth_121222_0023:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0023.webp',
    KC_FX_GainHealth_121222_0024:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0024.webp',
    KC_FX_GainHealth_121222_0025:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0025.webp',
    KC_FX_GainHealth_121222_0026:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0026.webp',
    KC_FX_GainHealth_121222_0027:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0027.webp',
    KC_FX_GainHealth_121222_0028:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0028.webp',
    KC_FX_GainHealth_121222_0029:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0029.webp',
    KC_FX_GainHealth_121222_0030:
        'fx sequences/GainHealth/KC_FX_GainHealth_121222_0030.webp',
    KC_FX_Poison_121222_0001:
        'fx sequences/Poison/KC_FX_Poison_121222_0001.webp',
    KC_FX_Poison_121222_0002:
        'fx sequences/Poison/KC_FX_Poison_121222_0002.webp',
    KC_FX_Poison_121222_0003:
        'fx sequences/Poison/KC_FX_Poison_121222_0003.webp',
    KC_FX_Poison_121222_0004:
        'fx sequences/Poison/KC_FX_Poison_121222_0004.webp',
    KC_FX_Poison_121222_0005:
        'fx sequences/Poison/KC_FX_Poison_121222_0005.webp',
    KC_FX_Poison_121222_0006:
        'fx sequences/Poison/KC_FX_Poison_121222_0006.webp',
    KC_FX_Poison_121222_0007:
        'fx sequences/Poison/KC_FX_Poison_121222_0007.webp',
    KC_FX_Poison_121222_0008:
        'fx sequences/Poison/KC_FX_Poison_121222_0008.webp',
    KC_FX_Poison_121222_0009:
        'fx sequences/Poison/KC_FX_Poison_121222_0009.webp',
    KC_FX_Poison_121222_0010:
        'fx sequences/Poison/KC_FX_Poison_121222_0010.webp',
    KC_FX_Poison_121222_0011:
        'fx sequences/Poison/KC_FX_Poison_121222_0011.webp',
    KC_FX_Poison_121222_0012:
        'fx sequences/Poison/KC_FX_Poison_121222_0012.webp',
    KC_FX_Poison_121222_0013:
        'fx sequences/Poison/KC_FX_Poison_121222_0013.webp',
    KC_FX_Poison_121222_0014:
        'fx sequences/Poison/KC_FX_Poison_121222_0014.webp',
    KC_FX_Poison_121222_0015:
        'fx sequences/Poison/KC_FX_Poison_121222_0015.webp',
    KC_FX_Poison_121222_0016:
        'fx sequences/Poison/KC_FX_Poison_121222_0016.webp',
    KC_FX_Poison_121222_0017:
        'fx sequences/Poison/KC_FX_Poison_121222_0017.webp',
    KC_FX_Poison_121222_0018:
        'fx sequences/Poison/KC_FX_Poison_121222_0018.webp',
    KC_FX_Poison_121222_0019:
        'fx sequences/Poison/KC_FX_Poison_121222_0019.webp',
    KC_FX_Poison_121222_0020:
        'fx sequences/Poison/KC_FX_Poison_121222_0020.webp',
    KC_FX_Poison_121222_0021:
        'fx sequences/Poison/KC_FX_Poison_121222_0021.webp',
    KC_FX_Poison_121222_0022:
        'fx sequences/Poison/KC_FX_Poison_121222_0022.webp',
    KC_FX_Poison_121222_0023:
        'fx sequences/Poison/KC_FX_Poison_121222_0023.webp',
    KC_FX_Poison_121222_0024:
        'fx sequences/Poison/KC_FX_Poison_121222_0024.webp',
    KC_FX_Poison_121222_0025:
        'fx sequences/Poison/KC_FX_Poison_121222_0025.webp',
    KC_FX_Poison_121222_0026:
        'fx sequences/Poison/KC_FX_Poison_121222_0026.webp',
    KC_FX_Poison_121222_0027:
        'fx sequences/Poison/KC_FX_Poison_121222_0027.webp',
    KC_FX_Poison_121222_0028:
        'fx sequences/Poison/KC_FX_Poison_121222_0028.webp',
    KC_FX_Poison_121222_0029:
        'fx sequences/Poison/KC_FX_Poison_121222_0029.webp',
    KC_FX_Poison_121222_0030:
        'fx sequences/Poison/KC_FX_Poison_121222_0030.webp',
    KC_FX_Poison_121222_0031:
        'fx sequences/Poison/KC_FX_Poison_121222_0031.webp',
    KC_FX_Poison_121222_0032:
        'fx sequences/Poison/KC_FX_Poison_121222_0032.webp',
    // KC_FX_PsychicAttack_121222_0001:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0001.webp',
    // KC_FX_PsychicAttack_121222_0002:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0002.webp',
    // KC_FX_PsychicAttack_121222_0003:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0003.webp',
    // KC_FX_PsychicAttack_121222_0004:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0004.webp',
    // KC_FX_PsychicAttack_121222_0005:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0005.webp',
    // KC_FX_PsychicAttack_121222_0006:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0006.webp',
    // KC_FX_PsychicAttack_121222_0007:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0007.webp',
    // KC_FX_PsychicAttack_121222_0008:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0008.webp',
    // KC_FX_PsychicAttack_121222_0009:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0009.webp',
    // KC_FX_PsychicAttack_121222_0010:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0010.webp',
    // KC_FX_PsychicAttack_121222_0011:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0011.webp',
    // KC_FX_PsychicAttack_121222_0012:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0012.webp',
    // KC_FX_PsychicAttack_121222_0013:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0013.webp',
    // KC_FX_PsychicAttack_121222_0014:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0014.webp',
    // KC_FX_PsychicAttack_121222_0015:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0015.webp',
    // KC_FX_PsychicAttack_121222_0016:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0016.webp',
    // KC_FX_PsychicAttack_121222_0017:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0017.webp',
    // KC_FX_PsychicAttack_121222_0018:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0018.webp',
    // KC_FX_PsychicAttack_121222_0019:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0019.webp',
    // KC_FX_PsychicAttack_121222_0020:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0020.webp',
    // KC_FX_PsychicAttack_121222_0021:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0021.webp',
    // KC_FX_PsychicAttack_121222_0022:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0022.webp',
    // KC_FX_PsychicAttack_121222_0023:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0023.webp',
    // KC_FX_PsychicAttack_121222_0024:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0024.webp',
    // KC_FX_PsychicAttack_121222_0025:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0025.webp',
    // KC_FX_PsychicAttack_121222_0026:
    //     'fx sequences/PsychicAttack/KC_FX_PsychicAttack_121222_0026.webp',
    KC_FX_Shield_121222_0001:
        'fx sequences/Shield/KC_FX_Shield_121222_0001.webp',
    KC_FX_Shield_121222_0002:
        'fx sequences/Shield/KC_FX_Shield_121222_0002.webp',
    KC_FX_Shield_121222_0003:
        'fx sequences/Shield/KC_FX_Shield_121222_0003.webp',
    KC_FX_Shield_121222_0004:
        'fx sequences/Shield/KC_FX_Shield_121222_0004.webp',
    KC_FX_Shield_121222_0005:
        'fx sequences/Shield/KC_FX_Shield_121222_0005.webp',
    KC_FX_Shield_121222_0006:
        'fx sequences/Shield/KC_FX_Shield_121222_0006.webp',
    KC_FX_Shield_121222_0007:
        'fx sequences/Shield/KC_FX_Shield_121222_0007.webp',
    KC_FX_Shield_121222_0008:
        'fx sequences/Shield/KC_FX_Shield_121222_0008.webp',
    KC_FX_Shield_121222_0009:
        'fx sequences/Shield/KC_FX_Shield_121222_0009.webp',
    KC_FX_Shield_121222_0010:
        'fx sequences/Shield/KC_FX_Shield_121222_0010.webp',
    KC_FX_Shield_121222_0011:
        'fx sequences/Shield/KC_FX_Shield_121222_0011.webp',
    KC_FX_Shield_121222_0012:
        'fx sequences/Shield/KC_FX_Shield_121222_0012.webp',
    KC_FX_Shield_121222_0013:
        'fx sequences/Shield/KC_FX_Shield_121222_0013.webp',
    KC_FX_Shield_121222_0014:
        'fx sequences/Shield/KC_FX_Shield_121222_0014.webp',
    KC_FX_Shield_121222_0015:
        'fx sequences/Shield/KC_FX_Shield_121222_0015.webp',
    KC_FX_Shield_121222_0016:
        'fx sequences/Shield/KC_FX_Shield_121222_0016.webp',
    KC_FX_Shield_121222_0017:
        'fx sequences/Shield/KC_FX_Shield_121222_0017.webp',
    KC_FX_Shield_121222_0018:
        'fx sequences/Shield/KC_FX_Shield_121222_0018.webp',
    KC_FX_Shield_121222_0019:
        'fx sequences/Shield/KC_FX_Shield_121222_0019.webp',
    KC_FX_Shield_121222_0020:
        'fx sequences/Shield/KC_FX_Shield_121222_0020.webp',
    KC_FX_Shield_121222_0021:
        'fx sequences/Shield/KC_FX_Shield_121222_0021.webp',
    KC_FX_Shield_121222_0022:
        'fx sequences/Shield/KC_FX_Shield_121222_0022.webp',
    KC_FX_Shield_121222_0023:
        'fx sequences/Shield/KC_FX_Shield_121222_0023.webp',
    KC_FX_Shield_121222_0024:
        'fx sequences/Shield/KC_FX_Shield_121222_0024.webp',
    KC_FX_Shield_121222_0025:
        'fx sequences/Shield/KC_FX_Shield_121222_0025.webp',
    KC_FX_Shield_121222_0026:
        'fx sequences/Shield/KC_FX_Shield_121222_0026.webp',
    KC_FX_Shield_121222_0027:
        'fx sequences/Shield/KC_FX_Shield_121222_0027.webp',
    KC_FX_Shield_121222_0028:
        'fx sequences/Shield/KC_FX_Shield_121222_0028.webp',
    KC_FX_Shield_121222_0029:
        'fx sequences/Shield/KC_FX_Shield_121222_0029.webp',
    KC_FX_Shield_121222_0030:
        'fx sequences/Shield/KC_FX_Shield_121222_0030.webp',
    KC_FX_Shield_121222_0031:
        'fx sequences/Shield/KC_FX_Shield_121222_0031.webp',
    KC_FX_Shield_121222_0032:
        'fx sequences/Shield/KC_FX_Shield_121222_0032.webp',
    KC_FX_Shield_121222_0033:
        'fx sequences/Shield/KC_FX_Shield_121222_0033.webp',
    // @endindex
}

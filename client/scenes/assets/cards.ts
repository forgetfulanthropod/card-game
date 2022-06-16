const cardArtAssets = {
    cardBodySlam: 'cards/Body Slam.png',
    cardJab: 'cards/Jab.png',
    cardSweepTheLeg: 'cards/Sweep The Leg.png',
    cardShield: 'cards/Shield.png',
    cardStrike: 'cards/Strike.png',
    cardShieldOfLight: 'cards/Shield of Light.png',
}

const cardTypeAssets = {
    cardTypeAttack: 'cards/parts/Attack.png',
    cardTypeDefense: 'cards/parts/Defense.png',
    cardTypeEnchantment: 'cards/parts/Enchantment.png',
    cardTypeUtility: 'cards/parts/Utility.png',
}

export type CardArtAssetId = keyof typeof cardArtAssets

export type CardTypeAssetId = keyof typeof cardTypeAssets
export type CardAssetId = keyof typeof cardAssets

export const cardAssets = {
    remainingEnergy: 'cards/energy flame.png',
    cardEnergy: 'cards/parts/energy.png',
    cardBackPileSizeOverlay: 'cards/card back pile size overlay.png',
    cardBack: 'cards/card back.png',
    ...cardArtAssets,
    ...cardTypeAssets,
} as const

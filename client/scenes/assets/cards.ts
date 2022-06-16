const cardBodySlam = 'cards/Body Slam.png'
const cardBackPileSizeOverlay = 'cards/card back pile size overlay.png'
const cardBack = 'cards/card back.png'
const cardEnergy = 'cards/parts/energy.png'
const cardJab = 'cards/Jab.png'
const cardTypeAttack = 'cards/parts/Attack.png'
const cardTypeDefense = 'cards/parts/Defense.png'
const cardTypeEnchantment = 'cards/parts/Enchantment.png'
const cardTypeUtility = 'cards/parts/Utility.png'
const cardShieldOfLight = 'cards/Shield of Light.png'
const cardShield = 'cards/Shield.png'
const cardStrike = 'cards/Strike.png'
const cardSweepTheLeg = 'cards/Sweep The Leg.png'
const remainingEnergy = 'cards/energy flame.png'

const cardArtAssets = {
    cardBodySlam,
    cardJab,
    cardSweepTheLeg,
    cardShield,
    cardStrike,
    cardShieldOfLight,
}

const cardTypeAssets = {
    cardTypeAttack,
    cardTypeDefense,
    cardTypeEnchantment,
    cardTypeUtility,
}

export type CardArtAssetId = keyof typeof cardArtAssets

export type CardTypeAssetId = keyof typeof cardTypeAssets
export type CardAssetId = keyof typeof cardAssets

export const cardAssets = {
    remainingEnergy,
    cardEnergy,
    cardBackPileSizeOverlay,
    cardBack,
    ...cardArtAssets,
    ...cardTypeAssets,
} as const

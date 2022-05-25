import cardBodySlam from '@battleAssets/cards/Body Slam.png'
import cardBackPileSizeOverlay from '@battleAssets/cards/card back pile size overlay.png'
import cardBack from '@battleAssets/cards/card back.png'
import cardJab from '@battleAssets/cards/Jab.png'
import cardTypeAttack from '@battleAssets/cards/parts/Attack.png'
import cardTypeDefense from '@battleAssets/cards/parts/Defense.png'
import cardTypeEnchantment from '@battleAssets/cards/parts/Enchantment.png'
import cardTypeUtility from '@battleAssets/cards/parts/Utility.png'
import cardShieldOfLight from '@battleAssets/cards/Shield of Light.png'
import cardShield from '@battleAssets/cards/Shield.png'
import cardStrike from '@battleAssets/cards/Strike.png'
import cardSweepTheLeg from '@battleAssets/cards/Sweep The Leg.png'

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
    cardBackPileSizeOverlay,
    cardBack,
    ...cardArtAssets,
    ...cardTypeAssets,
} as const

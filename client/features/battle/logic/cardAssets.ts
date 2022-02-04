import cardBodySlam from '../assets/cards/Body Slam.png'
import cardBackPileSizeOverlay from '../assets/cards/card back pile size overlay.png'
import cardBack from '../assets/cards/card back.png'
import cardJab from '../assets/cards/Jab.png'
import cardShieldOfLight from '../assets/cards/Shield of Light.png'
import cardShield from '../assets/cards/Shield.png'
import cardStrike from '../assets/cards/Strike.png'
import cardSweepTheLeg from '../assets/cards/Sweep The Leg.png'

const cardArtAssets = {
    cardBodySlam,
    cardJab,
    cardSweepTheLeg,
    cardShield,
    cardStrike,
    cardShieldOfLight,
}

export type CardArtAssetId = keyof typeof cardArtAssets

export const cardAssets = {
    cardBackPileSizeOverlay,
    cardBack,
    ...cardArtAssets,
}

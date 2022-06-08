import orbOfEnergy from '@battleAssets/char status/orbs/lightning.png'
import orbOfFrost from '@battleAssets/char status/orbs/lightning.png'
import orbOfLightning from '@battleAssets/char status/orbs/lightning.png'
import orbOfProtection from '@battleAssets/char status/orbs/protection.png'

export const orbAssets = {
    orbOfEnergy,
    orbOfFrost,
    orbOfLightning,
    orbOfProtection,
}

export type OrbAssetId = keyof typeof orbAssets

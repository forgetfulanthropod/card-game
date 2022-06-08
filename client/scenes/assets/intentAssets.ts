import enemyIntentArrow from '@battleAssets/intents/arrow_3.png'
import floatingIntentAmount from '@battleAssets/intents/floating intent amount.png'
import blockIntent from '@battleAssets/intents/npc/Shield intent.png'

export const intentAssets = {
    enemyIntentArrow,
    floatingIntentAmount,
    blockIntent,
}

export type IntentAssetId = keyof typeof intentAssets

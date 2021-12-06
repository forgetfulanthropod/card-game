import type { ClaimLoot } from '@shared'

import { commit, getRootCursor } from '@/util'

export const claimLoot: ClaimLoot = (args) => {
    logger.info(`wallet address ${args.walletAddress} claiming loot`)

    commit(getRootCursor())
}

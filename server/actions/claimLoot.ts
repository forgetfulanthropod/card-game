import type { ClaimLoot } from '@serverActions'
import axios from 'axios'

import { commit, getGameStateCursor } from '@/util'

const microService = 'http://localhost:3001/ft'

export const claimLoot: ClaimLoot = async (args) => {
    logger.info(`wallet address ${args.walletAddress} claiming loot`)

    // get db tokens
    const cursor = getGameStateCursor('alice')
    // reset to 0.

    const coin = cursor.select('coin')
    const curCoin = coin.get()

    coin.set(0)

    // make post request
    // guarantee success, or reset db tokens
    try {
        await axios.post(microService, {
            amount: curCoin,
            toAddress: args.walletAddress,
        })
    } catch (e) {
        logger.error(`Microservice error: ${JSON.stringify(e)}`)
        coin.set(curCoin)
    }


    commit(getGameStateCursor(args.username), args.username)
}

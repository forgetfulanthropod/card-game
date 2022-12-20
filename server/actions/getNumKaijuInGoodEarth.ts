import type { ServerActions, AuthUserDBActionProps } from 'shared'
import { getDbClient, sql as sqlTag } from '@/db/client'

export const getNumKaijuInGoodEarth: ServerActions['getNumKaijuInGoodEarth'] = async ({ walletAddress }) => {
    logger.info(`Checking Kaiju in Good Earth for: ${walletAddress}`)
    let sql = sqlTag.typeAlias('number')
    const connection = await getDbClient()
    const numKaijuOwned = await connection.oneFirst(sql`
        SELECT COUNT(*) FROM public.gq_kaijus where wallet = ${walletAddress}
    `)
    logger.info(`${walletAddress} has ${numKaijuOwned} living in Good Earth`)
    return { numKaijuOwned }
}

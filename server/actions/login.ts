import type { ServerActions } from 'shared'

import { makeNewUser } from './makeNewUser'
import { getGamestate } from '@/db'
import { emitNewGamestate } from '@/IO'
import { getDbClient } from '@/db/client'
import { sql as sqlTag } from 'slonik'

export const login: ServerActions['login'] = async ({ username }) => {
    try {
        const db = await getDbClient()
        const sql = sqlTag.unsafe

        const test = await db.any(sql`
            SELECT * from kaiju.user_info
        `)
        
        console.log('CALLED DB... BELOW IS RESULT')
        console.log(test)
    } catch (e) {
        console.error(e)
    }
}

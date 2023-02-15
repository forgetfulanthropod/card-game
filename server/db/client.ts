import { getLogger } from 'game'
import { readFileSync } from 'fs'
import path from 'path'
import {
    createPool,
    createSqlTag,
    DatabaseConnection,
    DatabasePool,
    DatabaseTransactionConnection,
    stringifyDsn,
} from 'slonik'
import * as z from 'zod'

export type DbClient =
    | DatabasePool
    | DatabaseConnection
    | DatabaseTransactionConnection

let pool: DatabasePool | null = null

export const getDbClient = async () => {
    if (pool) return pool
    const logger = getLogger()
    const url = stringifyDsn({
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        databaseName: process.env.PGDATABASE,
    })

    const isLocalhost = process.env.PGHOST === 'localhost' ? true : false

    const ssl = { ca: readFileSync(path.resolve('CA_CERT.crt')) }
    const maximumPoolSize = parseInt(process.env.MAX_POOL_SIZE ?? '20')

    pool = await createPool(url, {
        ssl: isLocalhost ? undefined : ssl,
        maximumPoolSize,
        // typeParsers: [{ name: 'int8', parse: val => BigInt(val) }],
    })

    return pool
}

export const sql = createSqlTag({
    typeAliases: {
        userId: z.object({
            userId: z.string(),
        }),
        userInfo: z.object({
            user_id: z.string(),
            username: z.nullable(z.string()),
        }),
        id: z.object({
            id: z.number(),
        }),
        void: z.object({}).strict(),
        number: z.object({
            number: z.number(),
        }),
        any: z.any(),
        leaderboard: z.object({
            user_id: z.string(),
            wallet_address: z.string(),
            username: z.nullable(z.string()),
            max_score: z.number(),
            start_ts: z.number(),
            end_ts: z.number(),
            run_id: z.number(),
            is_self: z.boolean(),
            leaderboard_rank: z.number(),
            adjusted_rank: z.number(),
        }),
        count: z.object({
            count: z.number(),
        }),
    },
})

import { getLogger } from '@/../game'
import { readFileSync } from 'fs'
import path from 'path'
import { config as loadDotEnv } from 'dotenv'
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
    loadDotEnv()

    const url = stringifyDsn({
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        databaseName: process.env.PGDATABASE,
    })

    const ssl = { ca: readFileSync(path.resolve('CA_CERT.crt')) }
    const maximumPoolSize = 15
    pool = await createPool(url, {
        ssl,
        maximumPoolSize,
        typeParsers: [{ name: 'int8', parse: val => BigInt(val) }],
    })

    return pool
}

export const sql = createSqlTag({
    typeAliases: {
        userId: z.object({
            userId: z.string(),
        }),
        id: z.object({
            userId: z.number(),
        }),
        void: z.object({}).strict(),
    },
})

import { config as loadDotEnv } from 'dotenv'

loadDotEnv()
// if you add a key here, also add it to the check on makeBuildInfo.mjs!!
const SERVER_ENV_KEYS = {
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGHOST: process.env.PGHOST,
    PGPORT: process.env.PGPORT,
    PGDATABASE: process.env.PGDATABASE,
    MAX_POOL_SIZE: process.env.MAX_POOL_SIZE,
    IS_PRODUCTION: process.env.IS_PRODUCTION,
    INFLUX_URL: process.env.INFLUX_URL,
    INFLUX_TOKEN: process.env.INFLUX_TOKEN,
    INFLUX_ORG: process.env.INFLUX_ORG,
    INFLUX_BUCKET: process.env.INFLUX_BUCKET,
    JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
    FIXED_SEED: process.env.FIXED_SEED,
    PORT: process.env.PORT,
    DEV_STATIC_ASSETS: process.env.DEV_STATIC_ASSETS
}

type ServerEnvKey = keyof typeof SERVER_ENV_KEYS

export const getServerEnv = (key: ServerEnvKey): string => {
    const value = SERVER_ENV_KEYS[key]
    if (value === undefined) {
        console.log(SERVER_ENV_KEYS)
        throw new Error(`${key} is undefined...`)
    }
    return value
}

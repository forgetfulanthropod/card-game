import { spawnSync } from 'child_process'

export function makeBuildInfo(prefix) {
    const gitBranch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
        encoding: 'utf8',
    }).output[1].trim()
    const gitCommit = spawnSync('git', ['log', '--oneline', '-1'], {
        encoding: 'utf8',
    }).output[1].trim()

    return {
        [`process.env.${prefix}BUILD_TIME`]: `${JSON.stringify(new Date())}`,
        [`process.env.${prefix}GIT_BRANCH`]: `${JSON.stringify(gitBranch)}`,
        [`process.env.${prefix}GIT_COMMIT`]: `${JSON.stringify(gitCommit)}`,
    }
}

const REQUIRED_SERVER_ENV_KEYS =
    ['PGUSER',
     'PGPASSWORD',
     'PGHOST',
     'PGPORT',
     'PGDATABASE',
     'MAX_POOL_SIZE',
     'IS_PRODUCTION',
     'INFLUX_URL',
     'INFLUX_ORG',
     'INFLUX_BUCKET',
     'INFLUX_TOKEN'
    ]

const REQUIRED_CLIENT_ENV_KEYS =
    ['WALLET_GATED',
     'RPC_URL',
     'GAME_IS_LIVE',
     'IS_PRODUCTION',
     'CLIENT_PASSWORD',
     'WALLET_CONNECT_ID'
    ]

/**
 *
 * @param {'client' | 'server'} env 'client'
 */
export const checkEnv = (env) => {
    console.log(`Checking ENV for ${env}...`)
    let envKeys = env === 'client' ? REQUIRED_CLIENT_ENV_KEYS : REQUIRED_SERVER_ENV_KEYS

    for (let key of envKeys) {
        const value = process.env[key]
        if (value === undefined) {
            console.error(key, `IS MISSING IN ${env} .ENV`)
            process.exit(1)
        }
    }
    console.log(`✅ ${env} .env contains all keys: `, envKeys)
}

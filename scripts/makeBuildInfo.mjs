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

const REQUIRED_SERVER_ENV_KEYS = [
    'IS_PRODUCTION',
    'LOG_LEVEL',
    'FIXED_SEED',
    'PORT',
    'DEV_STATIC_ASSETS'
]

const REQUIRED_CLIENT_ENV_KEYS = [
    'IS_PRODUCTION',
    'IS_LOCAL'
]

/**
 * env checks removed (no .env files)
 */
export const checkEnv = (env) => {
    console.log(`(env check skipped - no .env) for ${env}`)
}

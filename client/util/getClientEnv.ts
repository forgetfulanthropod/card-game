const CLIENT_ENV_KEYS = {
    WALLET_GATED: process.env.WALLET_GATED,
    RPC_URL: process.env.RPC_URL,
    GAME_IS_LIVE: process.env.GAME_IS_LIVE,
    IS_PRODUCTION: process.env.IS_PRODUCTION,
    CLIENT_GIT_BRANCH: process.env.CLIENT_GIT_BRANCH,
    CLIENT_GIT_COMMIT: process.env.CLIENT_GIT_COMMIT,
    CLIENT_BUILD_TIME: process.env.CLIENT_BUILD_TIME,
}

type ClientEnvKey = keyof typeof CLIENT_ENV_KEYS

export const getClientEnv = (key: ClientEnvKey): string => {
    const value = CLIENT_ENV_KEYS[key]
    if (value === undefined) {
        throw new Error(`${key} is undefined...`)
    }
    return value
}

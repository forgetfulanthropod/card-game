// env injected at build time by esbuild. .env and wallet stuff removed.
const CLIENT_ENV_KEYS: Record<string, any> = {
    IS_PRODUCTION: process.env.IS_PRODUCTION ?? 'false',
    IS_LOCAL: process.env.IS_LOCAL ?? 'true',
    CLIENT_GIT_BRANCH: process.env.CLIENT_GIT_BRANCH ?? '',
    CLIENT_GIT_COMMIT: process.env.CLIENT_GIT_COMMIT ?? '',
    CLIENT_BUILD_TIME: process.env.CLIENT_BUILD_TIME ?? '',
    // WALLET_* removed
}

type ClientEnvKey = keyof typeof CLIENT_ENV_KEYS

export const getClientEnv = (key: ClientEnvKey): string => {
    const value = (CLIENT_ENV_KEYS as any)[key]
    if (value === undefined) {
        // return empty rather than crash after clean
        return ''
    }
    return String(value)
}

export const envIsTrue = (key: ClientEnvKey, defaultValue = false): boolean => {
    const value = getClientEnv(key)
    if (value === '') return defaultValue
    return value === 'true' || value === '1'
}

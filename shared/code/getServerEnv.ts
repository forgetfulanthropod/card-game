// .env and dotenv removed. Provide safe defaults only for remaining used keys.
// No postgres, no external services required.
const DEFAULTS: Record<string, string> = {
    LOG_LEVEL: 'info',
    PORT: '3456',
    IS_PRODUCTION: 'false',
    FIXED_SEED: 'false',
    DEV_STATIC_ASSETS: 'yes',
    JWT_TOKEN_SECRET: 'dev-insecure-secret-remove-for-prod',
    MAX_POOL_SIZE: '5',
}

export const getServerEnv = (key: string): string => {
    if (key in DEFAULTS) return DEFAULTS[key]
    const fromProc = (process.env as any)[key]
    if (fromProc != null) return fromProc
    // for removed keys like PG* we return empty to not crash old paths (but they are unused now)
    return ''
}

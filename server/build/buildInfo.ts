import { getServerEnv } from '@/../shared'

const port = getServerEnv('PORT') ?? 3000
export const buildInfo = {
    port,
    gitBranch: process.env.SERVER_GIT_BRANCH ?? '',
    gitCommit: process.env.SERVER_GIT_COMMIT ?? '',
    buildTime: process.env.SERVER_BUILD_TIME ?? '',
}

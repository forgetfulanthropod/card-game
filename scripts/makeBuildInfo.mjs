import { spawnSync } from 'child_process'

export function makeBuildInfo(client = false) {
    const gitBranch = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: 'utf8' }).output[1].trim()
    const gitCommit = spawnSync("git", ["log", "--oneline", "-1"], { encoding: 'utf8' }).output[1].trim()

    return {
        [`process.env.${client && 'CLIENT_'}BUILD_TIME`]: `"${new Date()}"`,
        [`process.env.${client && 'CLIENT_'}GIT_BRANCH`]: `"${gitBranch}"`,
        [`process.env.${client && 'CLIENT_'}GIT_COMMIT`]: `"${gitCommit}"`,
    }
}

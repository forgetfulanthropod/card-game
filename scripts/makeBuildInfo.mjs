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

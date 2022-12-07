import seedrandom from 'seedrandom'

declare global {
    // eslint-disable-next-line no-var
    var srandom: () => number
}
let seed = Math.random().toString()
logger.info(`setting random seed: ${seed}`)
global.srandom = () => seedrandom(seed)()

export function setGlobalRandomSeed(): void {
    seed = Math.random().toString()
    logger.info(`setting random seed: ${seed}`)
}

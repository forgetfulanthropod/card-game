import seedrandom from 'seedrandom'

declare global {
    // eslint-disable-next-line no-var
    var srandom: () => number
}
// let seed = Math.random().toString()
let seed = 'seedTwo'
logger.info(`setting random seed: ${seed}`)
global.srandom = seedrandom(seed)

export function setGlobalRandomSeed(seed: string): void {
    global.srandom = seedrandom(seed)
    logger.info(`setting random seed: ${seed}`)
}

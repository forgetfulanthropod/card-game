import seedrandom from 'seedrandom'

declare global {
    // eslint-disable-next-line no-var
    var srandom: ReturnType<typeof seedrandom>
}
const seed = Math.random().toString()
logger.info(`setting random seed: ${seed}`)
global.srandom = seedrandom(seed)

export function setGlobalRandomSeed(seed = 'kaiju'): void {
    logger.info(`setting random seed: ${seed}`)
    global.srandom = seedrandom(seed)
}

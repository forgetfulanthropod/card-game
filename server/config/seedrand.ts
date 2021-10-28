import seedrandom from 'seedrandom'

declare global {
    // eslint-disable-next-line no-var
    var srandom: ReturnType<typeof seedrandom>
}
const seed = Math.random().toString()
logger.info('setting random seed:', seed)
global.srandom = seedrandom(seed)

export function setGlobalRandomSeed(): void {
    const seed = 'kaiju'
    logger.info('setting random seed:', seed)
    global.srandom = seedrandom(seed)
}

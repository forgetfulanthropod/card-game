import seedrandom from 'seedrandom'
export function setGlobalRandomSeed(useConstantFunction = false): void {
    if (useConstantFunction) {
        global.Math.random = () => 0
        return
    }
    const rng = seedrandom('kaiju')
    global.Math.random = rng
}

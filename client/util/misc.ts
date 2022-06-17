import { PixiTicker } from '@/elementsUtil'

export function nextFrame() {
    return new Promise(resolve => {
        setTimeout(resolve, 0)
    })
}

export function nextTick() {
    return new Promise(resolve => PixiTicker.shared.addOnce(resolve))
}

let lastLog = Date.now()
export function timelog(...args: unknown[]): void {
    const seconds = (Date.now() - lastLog) / 1000
    console.log(`[timelog] +${seconds.toFixed(4)}s:`, ...args)
    lastLog = Date.now()
}
declare global {
    // eslint-disable-next-line no-var
    var timelog: (...args: unknown[]) => void
}
window.timelog = timelog

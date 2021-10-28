
export const tl = (x: string): void => void logger.info(x)
const config = { log: true }

export function log(...args: unknown[]): void {
    if (config.log) { logger.info(args) }
}

export function warn(...args: unknown[]): void {
    if (config.log) { logger.warn(args) }
}

const Reset = '\x1b[0m'
const FgRed = '\x1b[31m'

export function consoleError(...args: unknown[]): void {
    console.error(FgRed, ...args, Reset)
}

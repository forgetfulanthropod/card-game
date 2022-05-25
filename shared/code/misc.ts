export function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function delayChain(callbacks: (() => unknown)[], delay = 1000) {
    for (const cb of callbacks) {
        await sleep(delay)
        cb()
    }
}

/** Ensures argument satisfies given type */
export function satisfies<T>(_: T) {}

// export function notnull

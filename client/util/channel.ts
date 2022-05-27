// const clog = (...args: unknown[]) => console.log('_channel_:', ...args)
export class Channel<T> {
    private readonly sendQ = new Queue<{
        resolveSend: Callback
        value: T
        timeoutId: number
    }>()
    private readonly readQ = new Queue<{
        resolveRead: (x: T) => void
        timeoutId: number
    }>()

    constructor(
        private readonly name = 'default',
        private readonly expirationTime: number = 10_000
    ) {}
    /** resolves when someone reads the value */
    async send(x: T): Promise<void> {
        this.revalidate()
        let resolveSend = null as unknown as Callback
        const p = new Promise<void>(r => (resolveSend = r))
        if (!this.readQ.isEmpty()) {
            // clog('send: resolving immediately')
            const { resolveRead, timeoutId } = this.readQ.pop()
            clearTimeout(timeoutId)
            resolveRead(x)
            setTimeout(resolveSend, 0)
        } else {
            const timeoutId = window.setTimeout(() => {
                throw Error(
                    `channel '${this.name}' send expired after ${
                        this.expirationTime
                    } milliseconds. value sent: ${JSON.stringify(x)}`
                )
            }, this.expirationTime)
            this.sendQ.add({ resolveSend, value: x, timeoutId })
        }
        return p
    }
    /** resolves when someone sends a value */
    async read(): Promise<T> {
        this.revalidate()
        let resolveRead = null as unknown as (x: T) => void
        const p = new Promise<T>(r => (resolveRead = r))
        if (!this.sendQ.isEmpty()) {
            // clog('read: resolving immediately')
            const { resolveSend, timeoutId, value } = this.sendQ.pop()
            clearTimeout(timeoutId)
            resolveRead(value) // TODO: is this ok?
            setTimeout(resolveSend, 0)
        } else {
            const timeoutId = window.setTimeout(() => {
                throw Error(
                    `channel '${this.name}' read expired after ${this.expirationTime} milliseconds`
                )
            }, this.expirationTime)
            this.readQ.add({ resolveRead, timeoutId })
        }
        return p
    }

    async readAssert(expected: T): Promise<void> {
        const actual = await this.read()
        if (actual !== expected)
            throw Error(
                `channel '${this.name}' readAssert failed. ` +
                    `expected: ${JSON.stringify(expected)}, ` +
                    `actual: ${JSON.stringify(actual)}`
            )
    }

    private revalidate() {
        if (!(this.sendQ.isEmpty() || this.readQ.isEmpty()))
            throw Error(
                'unreachable: channel has waiting sends and reads simultaneously'
            )
    }
}

/** Source: https://medium.com/@ashokjayaprakash/circular-queue-javascript-e258c48e7ff7 */
class Queue<T = unknown> {
    private element: (T | undefined)[] = []
    private length_ = 0
    private front = 0
    private back = -1
    constructor(private maxSize = 10_000) {}
    get length(): number {
        return this.length_
    }
    isEmpty(): boolean {
        return this.length_ === 0
    }
    add(element: T) {
        if (this.length_ >= this.maxSize)
            throw new Error('Maximum length_ exceeded')
        this.back++
        this.element[this.back % this.maxSize] = element
        this.length_++
    }
    pop(): T {
        if (this.isEmpty()) throw new Error('No elements in the queue')
        const value = this.getFront()
        this.element[this.front % this.maxSize] = undefined
        this.front++
        this.length_--
        return value
    }
    getFront(): T {
        if (this.isEmpty()) throw new Error('No elements in the queue')
        const val = this.element[this.front % this.maxSize]
        if (val === undefined)
            throw new Error(
                'Unreachable: queue is not empty but front is undefined'
            )
        return val
    }
    clear() {
        this.element = []
        this.length_ = 0
        this.back = 0
        this.front = -1
    }
}

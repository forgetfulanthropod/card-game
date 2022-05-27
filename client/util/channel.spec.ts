import { random } from 'lodash'
import { Channel } from './channel'

async function oneWayExample() {
    const channel = new Channel<number>()

    const send = async () => {
        const log = (...args: unknown[]) => console.log('SENDER:', ...args)
        // await sleep()
        log('waiting for them to get 42')
        await channel.send(42)
        log('they got 42')
        await sleep()
        log('waiting for them to get 99')
        await channel.send(99)
        log('they got 99')
        // log('sending 5 but nobody is listening. next line here never printed.')
        // await channel.send(5)
        // log('never printed')
    }

    const receive = async () => {
        const log = (...args: unknown[]) => console.log('RECEIVER:', ...args)
        // await sleep()
        log('waiting for first value from channel')
        const out1 = await channel.read()
        log(`i read ${out1}`)
        await sleep()
        log('waiting for second value from channel')
        const out2 = await channel.read()
        log(`i read ${out2}`)
        await sleep()
        log("waiting for third value from channel, but I'll never get it")
        await channel.read()
        log('this line never prints')
    }
    function sleep(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    await Promise.all([send(), receive()])
}

async function twoWayExample() {
    const channel = new Channel<string>()

    const alice = async () => {
        const log = (...args: unknown[]) => console.log('ALICE:', ...args)
        log('waiting for bob to send me a message')
        const message = await channel.read()
        log(`i got message: ${message}`)
        await sleep()
        log('sending message to bob')
        await channel.send('hey mate')
        log('my message was received')
    }

    const bob = async () => {
        const log = (...args: unknown[]) => console.log('BOB:', ...args)
        log('sending message to alice')
        await channel.send('oyyyyy')
        log('my message was received')
        await sleep()
        log('waiting for alice to send me a message')
        const message = await channel.read()
        log(`i got message: ${message}`)
    }

    function sleep() {
        const ms = Math.random() * 1000 + 500
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    await Promise.all([alice(), bob()])
}

async function largeExample() {
    const channel = new Channel<number>()
    const arr: (number | string)[] = []
    const n = 1000
    const sender = async () => {
        for (let i = 0; i < n; i++) {
            await sleep()
            await channel.send(i)
            arr.push('confirmed')
        }
    }
    const receiver = async () => {
        for (let i = 0; i < n; i++) {
            await sleep()
            const x = await channel.read()
            arr.push('got')
            arr.push(x)
        }
    }
    function validate() {
        for (let i = 0; i < n; i++) {
            if (
                arr[i * 3] !== 'got' ||
                arr[i * 3 + 1] !== i ||
                arr[i * 3 + 2] !== 'confirmed'
            ) {
                throw Error(
                    `unexpected value at index ${i}: ` +
                        JSON.stringify(arr.slice(i, i + 3))
                )
            }
        }
        console.log('validation passed')
    }

    await Promise.all([sender(), receiver()])
    validate()

    function sleep() {
        if (Math.random() < 0.9) return undefined
        const ms = random(1, 5)
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}
void largeExample()

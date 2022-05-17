import { compose, datum } from 'datums'
import { delayChain } from 'shared/code'

import { For, If, Sprite, Text } from './mypixi'
import { getTexture } from './pixiUtils'

export function ForExample() {
    const strings = datum(['a', 'b', 'c', 'd'])
    const keyed = compose(
        ([strings]) => strings.map(s => ({ key: s })),
        strings
    )

    delayChain([
        () => strings.set(['d', 'c', 'b', 'f']),
        () => strings.set([]),
        () => strings.set(randStrArr(100)),
        () => strings.set([]),
        () => strings.set(['d', 'c', 'b', 'f']),
        () => strings.set([]),
        () => {
            console.log('rapidly changing strings')
            for (let i = 0; i < 1000; i++) {
                strings.set(randStrArr(20))
            }
        },
        () => strings.set([]),
        () => strings.set([...strings.val, 'wow']),
    ])

    return For(
        keyed,
        ({ key }) =>
            Text({ text: key[0], style: { fontSize: 100, fill: 'red' } }),
        i => ({ y: 500, x: i * 100 })
    )
}

function randStrArr(length = 100): string[] {
    return new Array(length)
        .fill(null)
        .map(() => Math.random().toString().slice(3, 6))
}

export function IfExample() {
    const cond = datum(true)
    delayChain([
        () => cond.set(false),
        () => cond.set(false),
        () => cond.set(true),
        () => cond.set(false),
        () => cond.set(true),
        () => cond.set(true),
        () => {
            console.log('rapidly changing cond')
            for (let i = 0; i < 1000; i++) {
                cond.set(true)
                cond.set(false)
            }
        },
        () => cond.set(false),
        () => cond.set(true),
        () => cond.set(false),
        () => cond.set(true),
    ])
    return If(
        cond,
        () =>
            Text({ text: 'it is true', style: { fontSize: 100, fill: 'red' } }),
        () => Sprite({ src: getTexture('bookle'), x: 500, y: 500 })
    )
}

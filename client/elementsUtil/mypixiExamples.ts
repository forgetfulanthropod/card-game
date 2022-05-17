import { compose, datum } from 'datums'
import { delayChain } from 'shared/code'

import { For, Text } from './mypixi'

export function ForExample() {
    const strings = datum(['a', 'b', 'c', 'd'])
    const keyed = compose(
        ([strings]) => strings.map(s => ({ key: s })),
        strings
    )

    delayChain([
        () => strings.set(['d', 'c', 'b', 'f']),
        () => strings.set([]),
        () =>
            strings.set(
                new Array(100)
                    .fill(null)
                    .map(() => Math.random().toString().slice(3, 6))
            ),
        () => strings.set([]),
        () => strings.set(['d', 'c', 'b', 'f']),
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

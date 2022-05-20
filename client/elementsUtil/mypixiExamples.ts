import type { Datum } from 'datums'
import { compose, datum } from 'datums'
import { delayChain } from 'shared/code'

import { Adjust, Container, For, If, portalize, Sprite, Text } from './mypixi'
import { getTexture } from './pixiUtils'

export function ForExample() {
    const strings = datum(['a', 'b', 'c', 'd'])
    const keyed = compose(
        ([strings]) => strings.map(s => ({ key: s })),
        strings
    )

    void delayChain([
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
    startToggling(cond)
    return If(
        cond,
        () =>
            Text({ text: 'it is true', style: { fontSize: 100, fill: 'red' } }),
        () => Sprite({ src: getTexture('bookle'), x: 500, y: 500 })
    )
}

function startToggling(cond: Datum<boolean>) {
    void delayChain([
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
}

export function PortalizeExample() {
    const shown = datum(false)
    const hideShow = Text({
        text: 'hide/show',
        onClick: () => shown.set(!shown.val),
        style: { fontSize: 100, fill: 'red' },
    })
    const cont = If(shown, () => {
        const sprite = Sprite({ src: getTexture('bookle'), x: 500, y: 500 })

        const t1 = Text({
            text: 'in sprite',
            x: 200,
            y: 200,
            style: { fontSize: 100, fill: 'red' },
        })
        sprite.addChild(t1)
        const t2 = Text({
            text: 'on stage',
            x: 200,
            y: 200,
            style: { fontSize: 100, fill: 'red' },
        })
        portalize({ from: sprite, content: t2 })
        return sprite
    })
    startToggling(shown)
    return Container({ children: [hideShow, cont] })
}

export function AdjustExample() {
    const sprite = Sprite({ src: getTexture('bookle'), x: 500, y: 500 })
    const adjustedOnce = Adjust(sprite, {
        x: 100,
        y: 0,
        onClick: () => console.log('clicked'),
        anchor: 0.5,
    })
    const testContainer = Container({ children: [] })
    // no anchor!
    // @ts-expect-error
    Adjust(testContainer, { anchor: 0.5 })
    return Container({
        children: [
            Adjust(adjustedOnce, {
                x: adjustedOnce.x + 100,
                y: 50,
            }),
        ],
    })
}

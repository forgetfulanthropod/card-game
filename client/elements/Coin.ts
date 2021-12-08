import { getTree } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_WIDTH, Container, Text } from '@/elementsUtil'

export default function Coin(): PixiContainer {
    const coin = getTree().get('coin')
    getTree()
        .select('coin')
        .on('update', e => {
            text.text = getText(e.data.currentData)
        })

    const text = Text({
        text: getText(coin),
        style: {
            fill: 'white',
        },
        anchor: [1, 0],
    })
    return Container({
        name: 'PlanButton',
        x: BASE_WIDTH - 20,
        y: 0,
        children: [text],
        zIndex: 10,
    })
}

function getText(coin: number): string {
    return `coin: ${coin}`
}

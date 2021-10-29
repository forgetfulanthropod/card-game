import { changeScene } from '@/actions'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, dataOf, Sprite, Text } from '@/elementsUtil'


export function StartButton(): PixiContainer {

    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * .95,
        children: [
            Sprite({
                src: dataOf('gemButton'),
                anchor: [.5, 1],
                scale: .5,
                async onClick() {
                    await changeScene({ newSceneName: 'battle' })
                },
            }),
            Text({
                text: 'GO!',
                anchor: [.5, 1.5],
                style: {
                    fontFamily: 'VT323',
                    fontSize: 80,
                    fill: ['#fff', '#eee'],
                    stroke: '#999',
                    strokeThickness: 5,
                },
            }),
        ],
    })


    return root
}

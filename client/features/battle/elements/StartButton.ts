import { changeScene } from '@/actions'
import { dataOf } from '@/util/pixiUtils'

import type { PixiContainer } from './mypixi'
import { Container, Sprite, Text } from './mypixi'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

export function StartButton(): PixiContainer {

    const root = Container({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * .95,
        children: [
            Sprite({
                src: dataOf('gemButton'),
                anchor: [.5, 1],
                scale: .5,
                onClick() {
                    changeScene({ newSceneName: 'battle' })
                }
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
            })
        ],
    })


    return root
}

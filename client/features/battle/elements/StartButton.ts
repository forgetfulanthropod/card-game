import { numbers } from '@/data/battle/constants'
import { dataOf } from '@/util/pixiUtils'
import { changeScene } from '@@/logic/functions'
import { Container, PixiContainer, Sprite, Text } from './mypixi'


export function StartButton(): PixiContainer {

    const root = Container({
        x: numbers.BASE_WIDTH / 2,
        y: numbers.BASE_HEIGHT * .95,
        children: [
            Sprite({
                src: dataOf('gemButton'),
                anchor: [.5, 1],
                scale: .5,
                onClick() {
                    console.log('registering ')
                    changeScene('battle')
                }
            }),
            Text({
                text: 'GO!',
                anchor: [.5, .5],
                y: -60,
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

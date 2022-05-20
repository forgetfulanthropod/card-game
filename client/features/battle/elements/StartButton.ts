import { glowFilter } from './Character'
import { callApi } from '@/actions'
import type { PixiContainer } from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
    Text,
} from '@/elementsUtil'

export function StartButton(): PixiContainer {
    const bg = Sprite({
        src: getTexture('gemButton'),
        anchor: [0.5, 1],
        scale: 0.5,
        async onClick() {
            await callApi('ChangeScene', { newSceneName: 'battle' })
        },
        events: {
            pointerover() {
                bg.filters = [glowFilter]
            },
            pointerout() {
                bg.filters = []
            },
        },
    })

    bg.cursor = 'pointer'

    const root = Container({
        x: BASE_WIDTH * 0.87,
        y: BASE_HEIGHT * 0.6,
        children: [
            bg,
            Text({
                text: 'GO!',
                anchor: [0.5, 1.5],
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

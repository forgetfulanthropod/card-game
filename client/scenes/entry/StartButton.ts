import { callApi } from '@/actions'
import type { PixiContainer } from '@/elementsUtil'
import {
    glowFilter,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
} from '@/elementsUtil'

export function StartButton(): PixiContainer {
    const bg = Sprite({
        src: getTexture('gemButton'),
        anchor: 0.5,
        scale: (1920 * 0.25) / getTexture('gemButton').width,
        async onClick() {
            root.visible = false
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
        y: BASE_HEIGHT * 0.5,
        children: [
            bg,
            // Text({
            //     text: 'GO!',
            //     anchor: 0.5,
            //     style: {
            //         fontFamily: 'bigFont',
            //         fontSize: 100,
            //         fill: ['#fff', '#eee'],
            //         stroke: '#999',
            //         strokeThickness: 5,
            //     },
            // }),
        ],
    })

    return root
}

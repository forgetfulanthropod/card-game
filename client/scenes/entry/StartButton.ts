import { callApi } from '@/callApi'
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
        scale: (1920 * 0.2) / getTexture('gemButton').width,
        async onClick() {
            root.visible = false
            await callApi('changeScene', { newSceneName: 'battle' })
        },
        events: {
            pointerover() {
                bg.filters = [glowFilter]
            },
            pointerout() {
                bg.filters = null
            },
        },
    })

    bg.cursor = 'pointer'

    const root = Container(
        {
            x: BASE_WIDTH * 0.87,
            y: BASE_HEIGHT * 0.89,
        },
        bg
    )

    return root
}

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

export function GoButton(): PixiContainer {
    const bg = Sprite({
        src: getTexture('goButton'),
        anchor: 0.5,
        scale: (1920 * 0.18) / getTexture('goButton').width,
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

    bg.cursor = `url('assets/root/hand.webp'), pointer`

    const root = Container(
        {
            x: BASE_WIDTH * 0.85,
            y: BASE_HEIGHT * 0.88,
        },
        bg
    )

    return root
}

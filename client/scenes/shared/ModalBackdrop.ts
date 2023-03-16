import {
    Container,
    PixiTexture,
    Sprite,
    Text,
    PixiSprite,
    BASE_WIDTH,
    BASE_HEIGHT,
} from '@/elementsUtil'
import { Texture } from 'pixi.js'

// Make a ModalWithBackdrop in the future: A container with the backdrop that renders its children
export function ModalBackdrop(): PixiSprite {
    const Backdrop = Sprite({
        src: Texture.WHITE,
        tint: 0,
        alpha: 0.5,
        width: BASE_WIDTH * 2,
        height: BASE_HEIGHT * 2,
        events: {
            pointerenter: () => void 0,
        },
    })

    Backdrop.interactive = true
    Backdrop.cursor = 'default'

    return Backdrop
}

import {
    BASE_HEIGHT,
    BASE_WIDTH,
    DisplayObjectArgs,
    Sprite,
} from '@/elementsUtil'
import { Texture } from 'pixi.js'

export function Backdrop(args: DisplayObjectArgs) {
    return Sprite({
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        src: Texture.WHITE,
        tint: 0,
        alpha: 0.5,
        ...args,
    })
}

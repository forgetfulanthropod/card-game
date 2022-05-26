import {
    PixiContainer,
    PixiGraphics,
    PixiSprite,
    PixiText,
    PixiTexture,
} from './aliases'
import {
    applyShownArgs,
    applyContainerArgs,
    applyDisplayObjectArgs,
} from './_applyArgs'
import type {
    ContainerArgs,
    TextArgs,
    GraphicsArgs,
    SpriteArgs,
} from './_types'

const core = null
export const BASE_HEIGHT = 1080
export const BASE_WIDTH = 1920
export const SCALE_UNIVERSAL = BASE_WIDTH / 1920
// export type Sprite = PixiSprite
export function Sprite(args: SpriteArgs): PixiSprite {
    if (args.src == null) {
        console.error(`Sprite named '${args.name}' received null src arg`)
        console.trace()
        return PixiSprite.from(PixiTexture.WHITE)
    }
    const s = PixiSprite.from(args.src)

    applyShownArgs(s, args)
    return s
}
export function Container(args: ContainerArgs): PixiContainer {
    const c = new PixiContainer()
    applyContainerArgs(args, c)
    return c
}
export function Text(args: TextArgs): PixiText {
    const text = new PixiText(args.text, args.style)
    applyShownArgs(text, args)
    return text
}
export function Graphics(args: GraphicsArgs): PixiGraphics {
    const g = new PixiGraphics()
    args.draw(g)
    applyDisplayObjectArgs(g, args)
    return g
}

import type { Datum } from 'datums'
import type {
    PixiContainer,
    PixiGraphics,
    PixiSprite,
    PixiText,
} from './aliases'
import { getPixiApp } from './application'

export function bindIsHovered(
    el: PixiSprite | PixiContainer | PixiText | PixiGraphics,
    isHoveredDatum: Datum<boolean>
) {
    el.interactive = true
    el.on('pointerenter', () => isHoveredDatum.set(true))
    const setFalse = () => isHoveredDatum.set(false)
    el.on('pointerleave', setFalse)
    getPixiApp().stage.on('pointerleave', setFalse)
    el.on('destroyed', () => {
        isHoveredDatum.set(false)
        getPixiApp().stage.off('pointerleave', setFalse)
    })
}

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
    el.on('pointerover', () => isHoveredDatum.set(true))
    const setFalse = () => isHoveredDatum.set(false)
    el.on('pointerout', setFalse)
    getPixiApp().stage.on('pointerout', setFalse)
    el.on('destroyed', () => {
        isHoveredDatum.set(false)
        getPixiApp().stage.off('pointerout', setFalse)
    })
}

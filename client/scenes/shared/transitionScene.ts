import { AdjustmentFilter } from 'pixi-filters'
import { Easing, Tweener } from 'pixi-tweener'
import { PixiContainer } from '@/elementsUtil'

export const TRANSITION_SECONDS = 0.25

export async function transitionScene(
    sceneEl: PixiContainer,
    direction: 'out' | 'in'
): Promise<void> {
    const brightnessFrom = direction === 'out' ? 1 : 0
    const brightnessTo = direction === 'out' ? 0 : 1

    const filter = new AdjustmentFilter({
        brightness: brightnessFrom,
    })
    sceneEl.filters = [filter]
    await Tweener.add(
        {
            target: filter,
            duration: TRANSITION_SECONDS,
            ease: Easing.easeInExpo,
        },
        {
            brightness: brightnessTo,
        }
    ).then(() => {
        sceneEl.filters = null
        Tweener.killTweensOf(filter)
        setTimeout(() => filter.destroy(), 1000) // next frame destruction no bueno...

        // filter.destroy()
    })
}

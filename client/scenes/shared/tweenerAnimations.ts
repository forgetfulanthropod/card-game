import { TweenablePixiContainer } from '@/elementsUtil'
import { Easing, Tweener } from 'pixi-tweener'

// TODO: add other tweener animation fns here

export const animateBounceScale = async (el: TweenablePixiContainer) => {
    const { x, y, tweenableScale } = el

    await Tweener.add(
        {
            target: el,
            duration: 0.1,
            ease: Easing.bouncePast,
        },
        {
            tweenableScale: 1.3,
        }
    )
    await Tweener.add(
        {
            target: el,
            duration: 0.45,
            ease: Easing.easeTo,
        },
        {
            tweenableScale: tweenableScale,
        }
    )
}

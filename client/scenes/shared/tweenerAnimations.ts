import { ContainerArgs, TweenablePixiContainer } from '@/elementsUtil'
import { max } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'

// TODO: add other tweener animation fns here

type DurationInSeconds = number
type DurationInKeyframes = number
type TweenerKeyframe = Omit<ContainerArgs, 'scale'> & {
    keyframes: DurationInKeyframes
    ease?: (pos: number) => number
    tweenableScale?: number
}

/**
 *
 * @param el
 * @param originalScale: pass this whenever there's overlapping animations; the Tweener will likely not return the element to its original state otherwise
 */
export const animateBounceScale = async (el: TweenablePixiContainer, originalScale?: number) => {
    const { tweenableScale } = el

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
            tweenableScale: originalScale ?? tweenableScale,
        }
    )
}

export const animateFastBounceScale = (el: TweenablePixiContainer) => {
    const scale = el.tweenableScale
    return async () => await animateBounceScale(el, scale)
}

/**
 *
 * @param target Element to be animated.
 * @param animationDuration Total animation sequence duration in seconds - to calculate how long each keyframe should last.
 * @param tweenerKeyframe All TweenerKeyframes will be executed synchronously; Arrays of TweenerKeyframes will execute all of their individual keyframes in parallel and are treated like one single keyframe of length = max(keyframes count in array). In other words, the promise parsing the array is resolved when its longest animation is complete.
 * @returns A promise that resolves when all animations complete.
 */
export const runKeyframeAnimations = async (
    target: TweenablePixiContainer,
    animationDuration: DurationInSeconds,
    ...tweenerKeyframes: Array<TweenerKeyframe | TweenerKeyframe[]>
) => {
    const keyframeCount = getKeyframeCount(...tweenerKeyframes)
    const durationPerKeyframe = animationDuration / keyframeCount
    for (let keyframe of tweenerKeyframes) {
        if (Array.isArray(keyframe)) {
            await runParallelAnimations(target, durationPerKeyframe, keyframe)
        } else {
            await runAnimation(target, durationPerKeyframe, keyframe)
        }
    }
    return void 0
}

const getKeyframeCount = (
    ...tweenerKeyframes: Array<TweenerKeyframe | TweenerKeyframe[]>
): DurationInKeyframes => {
    const sumReducer = (prev: number, curr: number) => prev + curr
    return tweenerKeyframes
        .map(keyframe => {
            if (Array.isArray(keyframe)) {
                return max(keyframe.map(kf => kf.keyframes)) ?? 0
            } else {
                return keyframe.keyframes
            }
        })
        .reduce(sumReducer)
}

const runParallelAnimations = async (
    target: TweenablePixiContainer,
    durationPerKeyframe: DurationInSeconds,
    tweenerKeyframes: TweenerKeyframe[]
) => {
    const keyframeCount = getKeyframeCount(tweenerKeyframes)
    return await new Promise(resolve => {
        tweenerKeyframes.forEach(
            async kf => await runAnimation(target, durationPerKeyframe, kf)
        )
        setTimeout(() => {
            resolve(void 0)
        }, keyframeCount * durationPerKeyframe * 1000)
    })
}

const runAnimation = async (
    target: TweenablePixiContainer,
    durationPerKeyframe: DurationInSeconds,
    tweenerKeyframe: TweenerKeyframe
) => {
    const { keyframes, ease, ...props } = tweenerKeyframe
    const duration = keyframes * durationPerKeyframe
    return Tweener.add(
        {
            //@ts-ignore
            target,
            duration,
            ease,
        },
        { ...props }
    )
}

/**
 * @tutorial This animation lasts 2 seconds and has a total of 50 keyframes, so each keyframe lasts roughly 0.04 seconds
 */
const keyframeExample = () =>
    runKeyframeAnimations(
        new TweenablePixiContainer(),
        2,
        {
            keyframes: 10,
            x: 5,
        },
        {
            keyframes: 5,
            x: 10,
        },
        [
            { keyframes: 10, tweenableScale: 2 },
            { keyframes: 25, y: 10 },
            { keyframes: 10, x: 25 },
        ],
        {
            keyframes: 10,
            x: 3,
            y: 4,
        }
    )

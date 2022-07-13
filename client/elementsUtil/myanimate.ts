/* eslint-disable import/no-relative-parent-imports */
import { Graphics, MovieClip, load } from '@pixi/animate'
import { keys } from 'lodash'

import { allAnimations } from '../animations'

const allAnimationKeys = keys(allAnimations)

export function loadAllAnimateFiles(): void {
    allAnimationKeys.forEach(k =>
        //@ts-expect-error
        allAnimations[k].setup({ MovieClip, Graphics })
    )

    allAnimationKeys.map(k => {
        load(allAnimations[k], () => {})
    })
}

export function EffectOverlayAnimation() {
    const data = nextAnimateFile()

    const firstLibKey = keys(data.lib)[0]
    const EffectMovieClip = data?.lib?.[firstLibKey]
    console.log({ data, firstLibKey })

    const newClip = new EffectMovieClip()

    newClip.y -= 640
    newClip.scale.set(2.5)
    newClip.loop = false
    newClip.autoReset = false

    setTimeout(() => newClip.destroy(), 1500)

    return newClip
}

let nextAnimationIndex = 0
function nextAnimateFile() {
    return allAnimations[
        allAnimationKeys[nextAnimationIndex++ % allAnimationKeys.length]
    ]
}

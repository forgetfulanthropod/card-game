/* eslint-disable import/no-relative-parent-imports */
import { Graphics, MovieClip, load } from '@pixi/animate'
import { keys, random } from 'lodash'

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

export function EffectOverlayAnimation(isPc: boolean) {
    const data = nextAnimateFile(isPc)

    const firstLibKey = keys(data.lib)[0]
    const EffectMovieClip = data?.lib?.[firstLibKey]
    console.log({ data, firstLibKey })

    const newClip = new EffectMovieClip() as MovieClip

    newClip.y -= 640
    newClip.x = isPc ? -300 : 0
    newClip.scale.set(2.5)
    newClip.loop = false
    newClip.autoReset = false

    setTimeout(() => newClip.destroy(), 1500)

    return newClip
}

function nextAnimateFile(isPc: boolean) {
    const animKeys = allAnimationKeys.filter(key => {
        const isProperSide = isPc
            ? key.includes('_Player')
            : key.includes('_Enemy')
        const basics = ['BasicAttack001', 'BasicAttack002', 'BasicAttack005']
        return isProperSide && basics.find(b => key.includes(b))
    })

    return allAnimations[animKeys[random(false) % animKeys.length]]
}

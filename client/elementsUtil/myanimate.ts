/* eslint-disable import/no-relative-parent-imports */
import type { AnimateAsset } from '@pixi/animate'
import { Graphics, MovieClip, load } from '@pixi/animate'
import { keys, random } from 'lodash'

import { allAnimations } from '../animations'
// import { getTexture } from './AssetLoader'
import { SequenceAnimation } from './SequenceAnimation'

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

export function AttackOverlayAnimation(isPc: boolean) {
    return Animation(getOneOf(['BasicAttack001'], isPc), isPc)
}

export function BleedOverlayAnimation(isPc: boolean) {
    return Animation(getOneOf(['Bleed'], isPc), isPc)
}

export function GainBlockOverlayAnimation(isPc: boolean) {
    return SequenceAnimation('block', isPc)
}

export function LoseBlockOverlayAnimation(isPc: boolean) {
    return SequenceAnimation('loseBlock', isPc)
}

export function BreakBlockOverlayAnimation(isPc: boolean) {
    return SequenceAnimation('breakBlock', isPc)
}

export function PoisonOverlayAnimation(isPc: boolean) {
    return SequenceAnimation('poison', isPc)
}

function Animation(data: AnimateAsset, isPc: boolean) {
    const firstLibKey = keys(data.lib)[0]
    const EffectMovieClip = data?.lib?.[firstLibKey]
    // console.log({ data, firstLibKey })

    const newClip = new EffectMovieClip() as MovieClip

    newClip.scale.set(2.5)
    newClip.y -= (data?.height * 2.5) / 2
    newClip.x = isPc ? -300 : 0
    newClip.loop = false
    newClip.autoReset = false

    setTimeout(() => newClip.destroy(), 1500)

    return newClip
}

function getOneOf(possibilities: string[], isPc: boolean) {
    const animKeys = allAnimationKeys.filter(key => {
        const isProperSide = isPc
            ? !key.includes('_Enemy')
            : !key.includes('_Player')

        return isProperSide && possibilities.find(b => key.includes(b))
    })

    return allAnimations[animKeys[random(false) % animKeys.length]]
}

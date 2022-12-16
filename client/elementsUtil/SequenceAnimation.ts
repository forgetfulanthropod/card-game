import { AnimatedSprite } from 'pixi.js'
//todo
import { getTexture } from '.'
import { sequenceMap } from '@/assets/sequenceMap'

export function SequenceAnimation(
    sequenceKey: keyof typeof sequenceMap,
    isPc: boolean
) {
    const animation = new AnimatedSprite(
        sequenceMap[sequenceKey]?.map(assetKey => getTexture(assetKey))
    )

    animation.loop = false
    animation.anchor.set(isPc ? 0.5 : 0, 0.5)
    animation.animationSpeed = 0.5

    setTimeout(() => {
        animation.gotoAndPlay(0)
    }, 0)

    return animation
}

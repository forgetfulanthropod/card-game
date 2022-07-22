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

    setTimeout(() => {
        animation.scale.set(1.7)
        animation.anchor.set(isPc ? 0.5 : -0.2, 0.5)
        animation.animationSpeed = 0.5
        animation.play()
    }, 0)

    return animation
}

import type { CharacterMeta, StatChangesMap } from 'shared'
import type { MovieClip } from '@pixi/animate'
import type { PixiContainer } from '@/elementsUtil'
import {
    GainHealthOverlayAnimation,
    BleedOverlayAnimation,
    AttackOverlayAnimation,
    Container,
} from '@/elementsUtil'
import { statChangesDatum } from '@/util'

const TIME_BETWEEN_OVERLAY_ANIMATIONS = 250

export function EffectOverlayManager(
    characterMeta: CharacterMeta,
    offset: number
): PixiContainer {
    const root = Container({
        y: offset,
        onDestroy: [
            statChangesDatum.onChange(statChanges => {
                const animations: MovieClip[] = getAnimationsFrom(
                    statChanges,
                    characterMeta
                )

                if (animations.length) {
                    animations.forEach((anim, i) => {
                        setTimeout(() => {
                            root.addChild(anim)
                            setTimeout(() => root.removeChild(anim), 1000)
                        }, i * TIME_BETWEEN_OVERLAY_ANIMATIONS)
                    })
                }
            }),
        ],
    })

    return root
}

export function getAnimationsFrom(
    statChanges: StatChangesMap,
    characterMeta: CharacterMeta
) {
    const animations: MovieClip[] = []

    const changes = statChanges[characterMeta.uid]

    if (changes == null) return animations

    if (changes.health)
        animations.push(AttackOverlayAnimation(characterMeta.isPc))
    if (changes.effects?.find(e => e.id === 'bleed'))
        animations.push(BleedOverlayAnimation(characterMeta.isPc))
    // if (changes.effects?.find(e => e.id === 'poison')) {
    //     animations.push(PoisonOverlayAnimation(characterMeta.isPc))
    // }
    if ((changes.block ?? 0) > 0) {
        animations.push(GainHealthOverlayAnimation(characterMeta.isPc))
    }

    return animations
}

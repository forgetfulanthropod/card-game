import type { CharacterMeta, StatChangesMap } from 'shared'
import type { MovieClip } from '@pixi/animate'
import { keys } from 'shared/code'
import type { AnimatedSprite } from 'pixi.js'
import type { PixiContainer } from '@/elementsUtil'
import {
    PoisonOverlayAnimation,
    BreakBlockOverlayAnimation,
    LoseBlockOverlayAnimation,
    GainBlockOverlayAnimation,
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
        x: characterMeta.isPc ? 80 : -150,
        onDestroy: [
            statChangesDatum.onChange(statChanges => {
                const myStatChanges = statChanges[characterMeta.uid]
                if (
                    myStatChanges == null ||
                    myStatChanges?.wait ||
                    //@ts-expect-error
                    keys(myStatChanges).length === 0
                )
                    return

                const animations: (MovieClip | AnimatedSprite)[] =
                    getAnimationsFrom(statChanges, characterMeta)

                if (animations.length) {
                    animations.forEach((anim, i) => {
                        setTimeout(() => {
                            root.addChild(anim)
                            setTimeout(() => root.removeChild(anim), 1000)
                        }, i * TIME_BETWEEN_OVERLAY_ANIMATIONS)
                    })
                }

                statChangesDatum.set({
                    ...statChangesDatum,
                    [characterMeta.uid]: {},
                })
            }),
        ],
    })

    return root
}

export function getAnimationsFrom(
    statChanges: StatChangesMap,
    characterMeta: CharacterMeta
) {
    const animations: (MovieClip | AnimatedSprite)[] = []

    const changes = statChanges[characterMeta.uid]

    if (changes == null) return animations

    if (changes.health)
        animations.push(AttackOverlayAnimation(characterMeta.isPc))
    if (changes.effects?.find(e => e.id === 'bleed'))
        animations.push(BleedOverlayAnimation(characterMeta.isPc))
    if (changes.effects?.find(e => e.id === 'poison'))
        animations.push(PoisonOverlayAnimation(characterMeta.isPc))
    if ((changes.block ?? 0) > 0) {
        animations.push(GainBlockOverlayAnimation(characterMeta.isPc))
    }
    if ((changes.block ?? 0) < 0) {
        if (characterMeta.health <= 0)
            animations.push(LoseBlockOverlayAnimation(characterMeta.isPc))
        else animations.push(BreakBlockOverlayAnimation(characterMeta.isPc))
    }

    return animations
}

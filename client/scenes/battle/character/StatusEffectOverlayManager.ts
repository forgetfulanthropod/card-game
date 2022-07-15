import type { Datum } from 'datums'
import type { CharacterMeta, StatChangesMap } from 'shared'
import type { MovieClip } from '@pixi/animate'
import type { PixiContainer } from '@/elementsUtil'
import {
    GainHealthOverlayAnimation,
    BleedOverlayAnimation,
    Container,
    If,
} from '@/elementsUtil'

const TIME_BETWEEN_OVERLAY_ANIMATIONS = 200

export function StatusEffectOverlayManager(
    statChangesDatum: Datum<StatChangesMap>,
    characterMeta: CharacterMeta,
    offset: number
): PixiContainer {
    return If(statChangesDatum, statChanges => {
        const root = Container({ y: offset })
        const animations: MovieClip[] = getAnimationsFrom(
            statChanges,
            characterMeta
        )

        if (animations.length) {
            //TODO: time delay between
            animations.forEach((anim, i) => {
                setTimeout(
                    () => root.addChild(anim),
                    i * TIME_BETWEEN_OVERLAY_ANIMATIONS
                )
            })
            root.addChild(...animations)
        }

        return root
    })
}

export function getAnimationsFrom(
    statChanges: StatChangesMap,
    characterMeta: CharacterMeta
) {
    const animations: MovieClip[] = []

    const changes = statChanges[characterMeta.uid]

    if (changes == null) return animations

    console.log({ statChanges, characterMeta })

    // if (changes.health)
    //     animations.push(BlockOverlayAnimation(characterMeta.isPc))
    if (changes.effects?.find(e => e.id === 'bleed')) {
        animations.push(BleedOverlayAnimation(characterMeta.isPc))
    }
    if (changes.block) {
        animations.push(GainHealthOverlayAnimation(characterMeta.isPc))
    }

    return animations
}

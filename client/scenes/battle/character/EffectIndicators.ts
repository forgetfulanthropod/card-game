import { ROCursor } from 'sbaobab'
import { CharacterMeta, Effect } from 'shared'
import { compose, datum } from 'datums'
import { VisibleEffect as VisibleEffectId } from '@/assets'
import { getEffectIconSrc, invisibleEffects } from '@/assets'
import { glowFilter, PixiContainer } from '@/elementsUtil'
import { For, SCALE_UNIVERSAL, Container, Sprite, Text } from '@/elementsUtil'
import { statChangesDatum, toDatum } from '@/util'
import { TermExplanationIf, Explanation } from '@sharedElements'

export function EffectIndicators(characterCursor: ROCursor<CharacterMeta>) {
    const effectsCursor = characterCursor.select('effects')
    const data = compose(
        ([statChanges, effects], lastOut) => {
            if (statChanges[characterCursor.get('uid')]?.wait) return lastOut

            return effects.map(e => ({ ...e, key: Math.random().toString() }))
        },
        statChangesDatum,
        toDatum(effectsCursor, effects =>
            effects
                .filter(e => !invisibleEffects.includes(e.id))
                .map(e => ({
                    ...e,
                    key: e.id + e.counter,
                    id: e.id as VisibleEffectId,
                }))
        )
    )

    return For(
        //@ts-expect-error
        data,
        //@ts-expect-error
        effect => InteractiveEffectCounter(effect),
        idx => ({ y: 50, x: idx * 50 })
    )
}

function InteractiveEffectCounter(
    effect: Effect & { id: VisibleEffectId }
): PixiContainer {
    const isHovered = datum(false)
    const pointerover = () => isHovered.set(true)
    const pointerout = () => isHovered.set(false)
    const width = 60

    const root = Container(
        {
            name: `Effect-${effect.id}`,
            events: {
                pointerover,
                pointerdown: pointerover,
                pointerout,
                pointerup: pointerout,
            },
            onDestroy: [
                isHovered.onChange(
                    is => (root.filters = is ? [glowFilter] : [])
                ),
            ],
        },
        Sprite({
            src: getEffectIconSrc(effect.id),
            scale: width / getEffectIconSrc(effect.id).width,
            anchor: [0.5, 0.4],
        }),
        Text({
            text: `${effect.counter}`,
            anchor: [0.6, 1],
            style: {
                fontFamily: ['bigFont', 'monospace'],
                fontSize: 36,
                fill: 'white',
                stroke: 'black',
                strokeThickness: 5,
            },
        }),
        TermExplanationIf({
            isShown: isHovered,
            term: effect.id,
            xOffset: width,
        })
    )

    return root
}

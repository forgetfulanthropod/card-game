import { ROCursor } from 'sbaobab'
import { CharacterMeta, Effect } from 'shared'
import { compose, datum } from 'datums'
import { VisibleEffect as VisibleEffectId } from '@/assets'
import { getEffectIconSrc, invisibleEffects } from '@/assets'
import { glowFilter, If, PixiContainer } from '@/elementsUtil'
import { For, SCALE_UNIVERSAL, Container, Sprite, Text } from '@/elementsUtil'
import { statChangesDatum, toDatum } from '@/util'
import { TermExplanationIf, Explanation, KeyTerm } from '@sharedElements'

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
    const pointerenter = () => isHovered.set(true)
    const pointerleave = () => isHovered.set(false)
    const width = 60

    const root = Container(
        {
            name: `Effect-${effect.id}`,
            events: {
                pointerenter,
                pointerdown: pointerenter,
                pointerleave,
                pointerup: pointerleave,
            },
            onDestroy: [
                isHovered.onChange(
                    is => (root.filters = is ? [glowFilter] : [])
                ),
            ],
        },
        If(datum(true), () =>
            Sprite({
                src: getEffectIconSrc(effect.id),
                scale: width / getEffectIconSrc(effect.id).width,
                anchor: [0.5, 0.4],
            })
        ),
        Text({
            text: `${effect.counter}`,
            anchor: [1, 1],
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
            term: effect.id
                .replace('Debuff', '')
                .replace('Buff', '') as KeyTerm,
            xOffset: width,
        })
    )

    return root
}

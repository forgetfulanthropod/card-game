import {
    getEffectIconSrc,
    invisibleEffects,
    VisibleEffect as VisibleEffectId,
} from '@/assets'
import {
    Container,
    fontMap,
    For,
    glowFilter,
    If,
    PixiContainer,
    Sprite,
    Text,
} from '@/elementsUtil'
import { statChangesDatum, toDatum } from '@/util'
import { KeyTerm, TermExplanationIf } from '@sharedElements'
import { compose, datum } from 'datums'
import { ROCursor } from 'sbaobab'
import { CharacterMeta, Effect, passiveClassEffectIds } from 'shared'

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
        effect => InteractiveEffectCounter(effect, characterCursor.get()),
        idx => ({ y: 50, x: idx * 50 })
    )
}

function InteractiveEffectCounter(
    effect: Effect & { id: VisibleEffectId },
    characterMeta: CharacterMeta
): PixiContainer {
    const isHovered = datum(false)
    const pointerenter = () => isHovered.set(true)
    const pointerleave = () => isHovered.set(false)
    const width = 60

    //@ts-expect-error
    const isClassPassiveEffect = passiveClassEffectIds.includes(effect.id)

    const root = Container(
        {
            name: `Effect-${effect.id}`,
            events: {
                pointerenter,
                pointerdown: pointerenter,
                pointerleave,
                pointerup: pointerleave,
            },
            x: isClassPassiveEffect ? -20 : 0,
            y: isClassPassiveEffect ? 20 : 0,
            onDestroy: [
                isHovered.onChange(
                    is => (root.filters = is ? [glowFilter] : [])
                ),
            ],
        },
        If(datum(true), () =>
            Sprite({
                src: getEffectIconSrc(effect.id),
                scale: isClassPassiveEffect
                    ? 0.9
                    : width / getEffectIconSrc(effect.id).width,
                anchor: isClassPassiveEffect ? [0.765, 0.425] : [0.5, 0.4],
            })
        ),
        Text({
            text: `${effect.counter}`,
            anchor: isClassPassiveEffect ? 0.5 : [1, 0.7],
            style: {
                fontFamily: fontMap['bigFont'],
                //@ts-expect-error
                fontSize: effect.counter === '∞' ? 60 : 36,
                fill: isClassPassiveEffect ? 0 : 'white',
                stroke: 'black',
                strokeThickness: isClassPassiveEffect ? 0 : 5,
            },
        }),
        TermExplanationIf({
            isShown: isHovered,
            term: effect.id
                .replace('Debuff', '')
                .replace('Buff', '') as KeyTerm,
            xOffset: width,
            characterMeta,
        })
    )

    return root
}

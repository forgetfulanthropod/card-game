import type { Ability } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { Container, getTexture, Sprite, Text, fontMap } from '@/elementsUtil'

export function AbilityButtons(abilities: Ability[]): PixiContainer[] {
    return abilities.map((ability, i) => {
        return Container(
            {
                x: (275 / 2) * (i ? 1 : -1) + (i ? 15 : -15),
                y: 150,
                events: {
                    pointerenter() {},
                    pointerleave() {},
                    pointerup() {},
                },
            },
            Sprite({
                src: 'abilityButton',
                anchor: [0.5, 0.2],
                scale: 275 / getTexture('abilityButton').width,
            }),
            Text({
                text: ability.name,
                style: {
                    fontFamily: fontMap['sansFont'],
                    fontSize: 20,
                    fill: 0xdddddd,
                },
                anchor: [0.5, 0],
            })
        )
    })
}

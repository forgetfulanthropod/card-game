import type { OwnedCharacterStats } from 'shared'
import { compose } from 'datums'
import { InfoBox } from './InfoBox'
import { If, Text, Container, BASE_WIDTH } from '@/elementsUtil'
import { hoveredCharacterUid } from '@/util'

const stats = [
    { key: 'strength', color: 0xd44c47 },
    { key: 'wisdom', color: 0x563d69 },
    { key: 'dexterity', color: 0x337ea9 },
    { key: 'constitution', color: 0x1cc8af },
] as const

export function CharacterInfo(cm: OwnedCharacterStats) {
    const contentWidth = BASE_WIDTH * 0.3
    return If(
        compose(([uid]) => uid === cm.uid, hoveredCharacterUid),
        () =>
            InfoBox(
                Container({
                    children: [
                        Text({
                            text: cm.displayName,
                            style: {
                                fontFamily: 'bigFont',
                                fontSize: 40,
                                fill: 0xaaaaff,
                            },
                            anchor: [0.5, 0],
                        }),
                        ...stats.map((stat, i) => {
                            return Container({
                                y: 60,
                                x: ((i - 1.5) * contentWidth) / 4,
                                children: [
                                    Text({
                                        text: `${stat.key}`,
                                        style: {
                                            fontFamily: 'sansFont',
                                            fontSize: 20,
                                            fill: stat.color,
                                            align: 'center',
                                        },
                                        anchor: [0.5, 0],
                                    }),
                                    Text({
                                        text: `${cm[stat.key]}`,
                                        style: {
                                            fontFamily: 'bigFont',
                                            fontSize: 32,
                                            fill: stat.color,
                                            align: 'center',
                                        },
                                        y: 22,
                                        anchor: [0.5, 0],
                                    }),
                                ],
                            })
                        }),
                    ],
                })
            )
    )
}

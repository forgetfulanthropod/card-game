import type {
    Card,
    CharacterClass,
    CharacterUid,
    OwnedCharacterStats,
} from 'shared'
import { compose } from 'datums'
import { vals } from 'shared/code'
import { InfoBox } from './InfoBox'
import { CardsTiltedInLine } from './CardsTiltedInLine'
import {
    If,
    Text,
    Container,
    BASE_WIDTH,
    Sprite,
    getTexture,
    glowFilter,
    Adjust,
} from '@/elementsUtil'
import { hoveredCharacterUid, onUpdate } from '@/util'
import { getEntryScene } from '@/data'

const stats = [
    { key: 'strength', color: 0xd44c47 },
    { key: 'wisdom', color: 0x9e6ec2 },
    { key: 'defense', color: 0x337ea9 },
    { key: 'constitution', color: 0x1cc8af },
] as const

const _classColorMap: Record<CharacterClass, [number, number]> = {
    cleric: [0xbce42d, 0xffab44],
    knight: [0xe4a72f, 0xff435a],
    wizard: [0x44a0ff, 0x1184fa],
    bard: [0x44ff82, 0x016622],
    rogue: [0xaa44ff, 0x370561],
}

export function RootCharacterInfo() {
    const root = Container({
        onDestroy: [
            hoveredCharacterUid.onChange(update),
            onUpdate(getEntryScene().select('selectedCharacters'), sc => {
                update(hoveredCharacterUid.val)
            }),
        ],
    })

    return root

    function update(uid: CharacterUid | null) {
        root.removeChildren()

        if (uid == null) return

        const cm = getEntryScene()
            .get('selectedCharacters')
            .find(c => c.uid === uid)

        if (cm == null) return

        const characterInfo = CharacterInfo(cm)

        root.addChild(
            Adjust(characterInfo, {
                x: characterInfo.width * 0.5 + BASE_WIDTH * 0.67,
                y: characterInfo.height * 0.3,
            })
        )
    }
}

export function CharacterInfo(cm: OwnedCharacterStats) {
    const abilities = [
        {
            name: 'Sleepy Time Spores',
        },
        {
            name: 'Slow but Purposeful ',
        },
    ]

    const contentWidth = BASE_WIDTH * 0.23
    return If(
        compose(([uid]) => uid === cm.uid, hoveredCharacterUid),
        () => {
            const allCharCards = Container({
                children: CardsTiltedInLine({
                    cards: getAllPossibleCardsForCharacter(cm),
                    parentWidth: contentWidth * 0.8,
                }),
            })

            return InfoBox(
                Container({
                    children: [
                        Text({
                            text: cm.displayName,
                            style: {
                                fontFamily: 'bigFont',
                                fontSize: 40,
                                fill: 0xdddddd,
                            },
                            anchor: [0, 1],
                            x: -contentWidth * 0.5,
                        }),
                        // Text({
                        //     text: cm.class,
                        //     style: {
                        //         fontFamily: 'bigFont',
                        //         fontSize: 40,
                        //         fill: classColorMap[cm.class],
                        //         // stroke: 0xdddddd,
                        //         // strokeThickness: 3,
                        //         // letterSpacing: 5,
                        //     },
                        //     anchor: [1, 1],
                        //     x: contentWidth * 0.5,
                        // }),
                        // Sprite({
                        //     src: `${cm.class}ClassIcon`,
                        //     anchor: [1, 1],
                        //     x: contentWidth * 0.5,
                        //     scale:
                        //         150 /
                        //         (getTexture(`${cm.class}ClassIcon`)?.height ??
                        //             1),
                        // }),
                        ...stats.map((stat, i) => {
                            return Container({
                                y: 50,
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
                        ...abilities.map((ability, i) => {
                            return InfoBox(
                                Container({
                                    children: [
                                        Text({
                                            text: ability.name,
                                            style: {
                                                fontFamily: 'sansFont',
                                                fontSize: 20,
                                                fill: 0xdddddd,
                                            },
                                            anchor: [i, 0],
                                            x: -contentWidth * (0.5 - i),
                                        }),
                                    ],
                                }),
                                {
                                    y: 150,
                                }
                            )
                        }),
                        InfoBox(allCharCards, {
                            y: 190 + allCharCards.height / 2,
                            x: -allCharCards.width / 2,
                        }),
                    ],
                }),
                {
                    filters: [glowFilter],
                }
            ).addChild(
                Sprite({
                    src: `${cm.class}ClassIcon`,
                    anchor: [1, 1],
                    x: contentWidth * 0.5,
                    scale:
                        150 / (getTexture(`${cm.class}ClassIcon`)?.height ?? 1),
                })
            ).parent
        }
    )
}

function getAllPossibleCardsForCharacter(cm: OwnedCharacterStats): Card[] {
    return vals(getEntryScene().get('fullSelectedCharacterDecks', cm.uid))
}

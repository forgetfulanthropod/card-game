import type {
    Card,
    CharacterClass,
    CharacterUid,
    OwnedCharacterStats,
} from 'shared'
import { compose } from 'datums'
import { vals } from 'shared/code'
import { OutlineFilter } from 'pixi-filters'
import type { Ability } from '../entry/SelectedCharacters'
import { characterIdToAbilitiesMap } from '../entry/SelectedCharacters'
import { InfoBox } from './InfoBox'
import { CardsTiltedInLine } from './cards'
import {
    Text,
    Container,
    BASE_WIDTH,
    Sprite,
    getTexture,
    Adjust,
    IfHideShow,
} from '@/elementsUtil'
import { hoveredCharacterUid, onUpdate } from '@/util'
import { getEntryScene, getTree } from '@/data'

const stats = [
    { key: 'strength', color: 0xd44c47 },
    { key: 'wisdom', color: 0x9e6ec2 },
    { key: 'defense', color: 0x337ea9 },
    { key: 'constitution', color: 0x1cc8af },
] as const

const classColorMap: Record<CharacterClass, [number, number]> = {
    cleric: [0xbce42d, 0xffab44],
    knight: [0xe4a72f, 0xff435a],
    wizard: [0x44a0ff, 0x9f6ec2],
    bard: [0x44ff82, 0x016622],
    rogue: [0xaa44ff, 0x370561],
}

export function RootCharacterInfo() {
    const root = Container({
        onDestroy: [
            hoveredCharacterUid.onChange(update),
            onUpdate(getEntryScene().select('selectedCharacters'), _sc => {
                update(hoveredCharacterUid.val)
            }),
        ],
    })

    return root

    function update(uid: CharacterUid | null) {
        root.removeChildren()

        if (uid == null) return
        if (getTree().get('scene', 'id') !== 'entry') return

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
    const abilities = characterIdToAbilitiesMap[cm.id]

    if (abilities == null) throw new Error('PCs need abilities!')

    return IfHideShow(
        compose(([uid]) => uid === cm.uid, hoveredCharacterUid),
        FullInfoBox({ cm, abilities })
    )
}

function getAllPossibleCardsForCharacter(cm: OwnedCharacterStats): Card[] {
    return vals(getEntryScene().get('fullSelectedCharacterDecks', cm.uid))
}

function FullInfoBox(props: { cm: OwnedCharacterStats; abilities: Ability[] }) {
    const contentWidth = BASE_WIDTH * 0.23
    const allCharCards = CardsTiltedInLine({
        cards: getAllPossibleCardsForCharacter(props.cm),
        parentWidth: contentWidth * 0.8,
    })

    const outlineFilter = new OutlineFilter(6, classColorMap[props.cm.class][1])
    const mainPadding = 40

    return InfoBox(
        Container(
            {},

            Text({
                text: props.cm.displayName,
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
            //     contentWidth * 0.5,
            // }),
            // Sprite({
            //     src: `${cm.class}ClassIcon`,
            //     anchor: [1, 1],
            //     contentWidth * 0.5,
            //     scale:
            //         150 /
            //         (getTexture(`${cm.class}ClassIcon`)?.height ??
            //             1),
            // }),
            ...stats.map((stat, i) => {
                return Container(
                    {
                        y: 50,
                        x: ((i - 1.5) * contentWidth) / 4,
                    },

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
                        text: `${props.cm[stat.key]}`,
                        style: {
                            fontFamily: 'bigFont',
                            fontSize: 32,
                            fill: stat.color,
                            align: 'center',
                        },
                        y: 22,
                        anchor: [0.5, 0],
                    })
                )
            }),
            ...props.abilities.map((ability, i) => {
                return InfoBox(
                    Container(
                        {},
                        Text({
                            text: ability.name,
                            style: {
                                fontFamily: 'sansFont',
                                fontSize: 20,
                                fill: 0xdddddd,
                            },
                            anchor: [i, 0],
                            x: -contentWidth * (0.5 - i),
                            y: 150,
                        })
                    ),
                    {
                        padding: 20,
                    }
                )
            })
        ),
        {
            filters: [outlineFilter],
            onDestroy: [() => outlineFilter.destroy()],
            padding: mainPadding,
        }
    ).addChild(
        Sprite({
            src: `${props.cm.class}ClassIcon`,
            anchor: [0.5, 0.8],
            x: contentWidth * 0.5,
            scale:
                150 / (getTexture(`${props.cm.class}ClassIcon`)?.height ?? 1),
        }),
        Adjust(allCharCards, {
            y: 190,
            x:
                -allCharCards.width / 2 +
                (contentWidth + mainPadding * 2 - allCharCards.width) * 0.675,
        })
    ).parent
}

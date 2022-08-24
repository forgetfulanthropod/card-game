import type {
    Card,
    CharacterClass,
    CharacterUid,
    OwnedCharacterStats,
} from 'shared'
import { compose } from 'datums'
import { vals } from 'shared/code'
import { OutlineFilter } from 'pixi-filters'
import { Texture } from 'pixi.js'
import { InfoBox } from '@sharedElements'
import { AbilityButtons } from './AbilityButtons'
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
import type { Ability } from '@/data'
import { getEntryScene, getTree, characterIdToAbilitiesMap } from '@/data'

const stats = [
    { key: 'strength', displayName: 'strength', color: 0xd44c47 },
    { key: 'wisdom', displayName: 'wisdom', color: 0x9e6ec2 },
    { key: 'defense', displayName: 'defense', color: 0x337ea9 },
    { key: 'constitution', displayName: 'const.', color: 0x1cc8af },
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
            .find(c => c?.uid === uid)

        if (cm == null) return

        const characterInfo = CharacterInfo(cm)

        root.addChild(
            Adjust(characterInfo, {
                x: characterInfo.width * 0.5 + BASE_WIDTH * 0.67,
                y: 78 + characterInfo.width * 0.1,
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

    const classOutlineFilter = new OutlineFilter(5, 0)
    const classOutlineFilter2 = new OutlineFilter(3, 0)
    const whiteOutlineFilter = new OutlineFilter(5, 0xbbbbbb)
    const mainPadding = 40

    return InfoBox(
        Container(
            {},
            Sprite({
                src: Texture.WHITE,
                width: contentWidth,
                alpha: 0,
                anchor: 0.5,
            }),
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
                        text: `${stat.displayName}`,
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
            })
        ),
        {
            filters: [classOutlineFilter],
            onDestroy: [
                () => classOutlineFilter.destroy(),
                () => whiteOutlineFilter.destroy(),
            ],
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
        ...AbilityButtons(props.abilities),
        Adjust(allCharCards, {
            y: 220,
            x: -allCharCards.width + contentWidth / 2 + mainPadding,
            filters: [classOutlineFilter2],
        })
    ).parent
}

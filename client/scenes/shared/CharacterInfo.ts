import {
    Ability,
    characterIdToAbilitiesMap,
    getBattleScene,
    getEntryScene,
    getTree,
} from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import {
    Adjust,
    BASE_WIDTH,
    Container,
    getTexture,
    If,
    Sprite,
    Text,
    fontMap,
} from '@/elementsUtil'
import {
    hoveredCharacterStatsOverride,
    hoveredCharacterUid,
    toDatum,
} from '@/util'
import { compose, datum } from 'datums'
import { upperFirst } from 'lodash'
import { OutlineFilter } from 'pixi-filters'
import { Tweener } from 'pixi-tweener'
import { Texture } from 'pixi.js'
import {
    Card,
    CharacterClass,
    CharacterMeta,
    CharacterStats,
    getFullTitle,
    SwordParts,
} from 'shared'
import { sleep, vals } from 'shared/code'
import { AbilityButtons } from './AbilityButtons'
import { CardsTiltedInLine } from './cards'
import { ExplanationIf, KeyTerm, TermExplanationsIf } from './Explanation'
import { InfoBox } from './InfoBox'

const stats = [
    { key: 'strength', displayName: 'Strength', color: 0xd44c47 },
    { key: 'magic', displayName: 'Magic', color: 0x9e6ec2 },
    { key: 'defense', displayName: 'Defense', color: 0x337ea9 },
    { key: 'constitution', displayName: 'Health', color: 0x1cc8af },
] as const

const _classColorMap: Record<CharacterClass, [number, number]> = {
    cleric: [0xbce42d, 0xffab44],
    knight: [0xe4a72f, 0xff435a],
    wizard: [0x44a0ff, 0x9f6ec2],
    bard: [0x44ff82, 0x016622],
    rogue: [0xaa44ff, 0x370561],
}
const CONTENT_WIDTH = BASE_WIDTH * 0.23

export function EntrySceneCharacterInfo() {
    return If(
        compose(
            ([
                hoveredCharacterStatsOverride,
                hoveredCharacterUid,
                selectedCharacters,
            ]) => {
                return (
                    hoveredCharacterStatsOverride ??
                    selectedCharacters.find(c => hoveredCharacterUid === c?.uid)
                )
            },
            hoveredCharacterStatsOverride,
            hoveredCharacterUid,
            toDatum(getEntryScene().select('selectedCharacters'), sc => sc)
        ),
        cm => RootCharacterInfo(cm)
    )
}

export function BattleSceneCharacterInfo() {
    const isDoneAnimatingOutDatum = datum<boolean>(true)

    return If(
        compose(
            (
                [hoveredCharacterUid, allCharacters, isDoneAnimatingOut],
                lastOut
            ) => {
                if (hoveredCharacterUid == null) return null

                const character = allCharacters[hoveredCharacterUid]

                if (character == null) return null

                const playerCharacter = character.isPc ? character : null

                if (!isDoneAnimatingOut && playerCharacter == null)
                    return lastOut as CharacterMeta | null

                return playerCharacter
            },
            hoveredCharacterUid,
            toDatum(getBattleScene().select('allCharacters'), ac => ac),
            isDoneAnimatingOutDatum
        ),
        //@ts-expect-error
        (cm: CharacterMeta) => {
            const root = RootCharacterInfo(cm, 40, 78)

            root.alpha = 0

            isDoneAnimatingOutDatum.set(false)

            Tweener.killTweensOf(root)

            void sleep(1000).then(() =>
                Tweener.add(
                    {
                        target: root,
                        duration: 0.3,
                    },
                    {
                        alpha: 1,
                    }
                )
            )

            hoveredCharacterUid.onChange(uid => {
                if (uid == null)
                    void Tweener.add(
                        {
                            target: root,
                            duration: 1,
                        },
                        {
                            alpha: 0,
                        }
                    ).then(() => {
                        isDoneAnimatingOutDatum.set(true)
                    })
            })

            root.addListener('destroyed', () => {
                Tweener.killTweensOf(root)
            })

            return root
        }
    )
}

function RootCharacterInfo(
    cm: CharacterStats | CharacterMeta,
    x = BASE_WIDTH * 0.67,
    y = 78
): PixiContainer {
    const characterInfo = CharacterInfo(cm as CharacterMeta)

    return Adjust(characterInfo, {
        x: CONTENT_WIDTH * 0.6 + x,
        y: y + characterInfo.width * 0.1,
    })
}

export function CharacterInfo(cm: CharacterMeta) {
    const abilities = characterIdToAbilitiesMap[cm.id]

    if (abilities == null) throw new Error('PCs need abilities!')

    return FullInfoBox({ cm, abilities })
}

function getAllPossibleCardsForCharacter(cm: CharacterMeta): Card[] {
    return cm.uid
        ? vals(getEntryScene().get('fullSelectedCharacterDecks', cm.uid))
        : []
}

function FullInfoBox(props: { cm: CharacterMeta; abilities: Ability[] }) {
    let cards

    //todo:
    //const startingCards =

    const allCharCards =
        getTree().get('scene', 'id') === 'entry' &&
        (cards = getAllPossibleCardsForCharacter(props.cm)).length
            ? CardsTiltedInLine({
                  cards,
                  parentWidth: CONTENT_WIDTH * 0.8,
              })
            : Container({})

    // const allCharCards = Container({})

    const classOutlineFilter = new OutlineFilter(5, 0)
    const classOutlineFilter2 = new OutlineFilter(3, 0)
    const whiteOutlineFilter = new OutlineFilter(5, 0xffffff)
    const mainPadding = 40

    return InfoBox(
        Container(
            {},
            Sprite({
                src: Texture.WHITE,
                width: CONTENT_WIDTH,
                alpha: 0,
                anchor: 0.5,
            }),
            Text({
                text: props.cm.displayName,
                style: {
                    fontFamily: fontMap['bigFont'],
                    fontSize: 40,
                    fill: 0xdddddd,
                },
                anchor: [0, 1],
                x: -CONTENT_WIDTH * 0.5,
            }),
            Text({
                text: upperFirst(props.cm.class),
                style: {
                    fontFamily: fontMap['sansFont'],
                    fontSize: 20,
                    fill: 0x708090,
                    fontStyle: 'italic',
                    padding: 2,
                },
                anchor: [0, 1],
                x: -CONTENT_WIDTH * 0.5 + 3,
                y: 28,
            }),
            // Text({
            //     text: cm.class,
            //     style: {
            //         fontFamily: 'Aesthet Nova',
            //         fontSize: 40,
            //         fill: classColorMap[cm.class],
            //         // stroke: 0xdddddd,
            //         // strokeThickness: 3,
            //         // letterSpacing: 5,
            //     },
            //     anchor: [1, 1],
            //     contentWidth * 0.5,
            // }),
            ...stats.map((stat, i) => {
                return Container(
                    {
                        y: 50,
                        x: ((i - 1.5) * CONTENT_WIDTH) / 4,
                    },

                    Text({
                        text: `${stat.displayName}`,
                        style: {
                            fontFamily: fontMap['sansFont'],
                            fontSize: 20,
                            fill: stat.color,
                            align: 'center',
                        },
                        anchor: [0.5, 0],
                    }),
                    Text({
                        text: `${
                            props.cm.calculatedStats?.[stat.key] ??
                            props.cm[stat.key]
                        }`,
                        style: {
                            fontFamily: fontMap['bigFont'],
                            fontSize: 32,
                            fill: stat.color,
                            align: 'center',
                        },
                        y: 22,
                        anchor: [0.5, 0],
                    })
                )
            })
            // Sprite({
            //     src: `${props.cm.class}ClassIcon`,
            //     anchor: [1, 0.8],
            //     x: -CONTENT_WIDTH * 0.5,
            //     scale:
            //         100 /
            //         (getTexture(`${props.cm.class}ClassIcon`)?.height ?? 1),
            // })
        ),
        {
            filters: [classOutlineFilter],
            onDestroy: [
                () => {
                    classOutlineFilter.destroy()
                    classOutlineFilter2.destroy()
                    whiteOutlineFilter.destroy()
                },
            ],
            padding: mainPadding,
        }
    ).addChild(
        ...AbilityButtons(props.abilities),
        Sprite({
            src: Texture.EMPTY,
            anchor: [0, 1],
            x: CONTENT_WIDTH * 0.5,
            width: 1,
            height: 200,
        }), //
        ...(props.cm.sword
            ? [
                  Adjust(Sword(props.cm.sword), {
                      filters: [whiteOutlineFilter],
                  }),
              ]
            : []),
        ...AbilityButtons([]),
        Adjust(allCharCards, {
            y: 200,
            x: -allCharCards.width + CONTENT_WIDTH / 2 + mainPadding,
            filters: [classOutlineFilter2],
        })
    ).parent
}

export function Sword(parts: SwordParts) {
    const isHovered = datum(false)

    return Container(
        {},
        Sprite({
            //@ts-ignore
            src: `https://media.kaijucards.io/cdn-cgi/image/width=250,quality=75/webp/swords-plain/${parts.guard.kind}-${parts.handle.kind}-${parts.pommel.kind}-${parts.blade.kind}.webp`,
            anchor: [0.5, 0.5],
            x: CONTENT_WIDTH * 0.59,
            events: {
                pointerenter() {
                    isHovered.set(true)
                },
                pointerout() {
                    isHovered.set(false)
                },
            },
        }),
        TermExplanationsIf({
            areShown: isHovered,
            yOffset: 170,
            terms: [
                getFullTitle(parts) as KeyTerm,
                `blade${upperFirst(parts.blade.kind)}` as KeyTerm,
                `guard${upperFirst(parts.guard.kind)}` as KeyTerm,
                `handle${upperFirst(parts.handle.kind)}` as KeyTerm,
                `pommel${upperFirst(parts.pommel.kind)}` as KeyTerm,
            ],
        })
    )
}

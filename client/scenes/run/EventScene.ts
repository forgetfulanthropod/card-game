import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    DisplayObject,
    fontMap,
    getTexture,
    glowFilter,
    If,
    loopSong,
    PixiContainer,
    RoundedRectangleGradientSprite,
    Sprite,
    Text,
} from '@/elementsUtil'
import { Datum, datum } from 'datums'
import { upperFirst } from 'lodash'
import { KawaseBlurFilter } from 'pixi-filters'
import { TextStyle, Texture } from 'pixi.js'
import { CharacterUid, EventScene, Souvenir, souvenirMap } from 'shared'
import { vals } from 'shared/code'
import { SpineBackground } from '../background'
import {
    BattleSceneCharacterInfo,
    ExplanationIf,
    MainCharacterAnimation,
    TEXT_WIDTH,
} from '../shared'
import { SouvenirEl, SouvenirsEls } from './Souvenirs'

export type EventResponse = { index: number; characterUid?: CharacterUid }

const explanationScale = 1.2

export function EventScene(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Event Scene' })

    loopSong('eventSceneMusicHooligansBluff')

    const eventPromptIndexDatum = datum(0)
    const choiceDatum = datum<null | EventResponse>(null)
    const event = getBattleScene().get('currentRoom', 'event')

    if (event == null)
        throw new Error('trying to render event scene without event ID')

    const eventId = event?.id

    const eventIdUpperFirst = upperFirst(eventId)
    // const eventPromptKeys = keys(eventAssets).filter(k =>
    //     k.includes(`${eventIdUpperFirst}Prompt`)
    // )

    const eventGradient = Sprite({
        src: 'eventGradient',
        height: BASE_HEIGHT,
        width: BASE_WIDTH,
        events: {
            pointerup() {
                eventPromptIndexDatum.set(eventPromptIndexDatum.val + 1)
                // if (eventPromptIndexDatum.val < eventPromptKeys.length)
            },
        },
    })

    const src = getTexture(`event${eventIdUpperFirst}MainGraphic` as AssetKey)

    return Container(
        {
            onDestroy: [
                eventPromptIndexDatum.onChange(index => {
                    if (index === event.prompts.length)
                        eventGradient.interactive = false

                    if (index > event.prompts.length)
                        eventGradient.interactive = true
                }),
            ],
        },
        Adjust(
            SpineBackground({
                srcs: ['hooligansBluffBg1_0', 'hooligansBluffBg1_1'],
            }),
            {
                filters: [new KawaseBlurFilter(1)],
            }
        ),
        eventGradient,
        Sprite({
            src,
            scale: src.height > 1080 ? 0.4 : 1,
            // scale:
            //     (BASE_HEIGHT * 0.5) /
            //     getTexture(`event${eventIdUpperFirst}MainGraphic` as AssetKey)
            //         .height,
            anchor: [0.5, src.height > 1080 ? 1 : 0],
            x: BASE_WIDTH / 2,
            y: src.height > 1080 ? BASE_HEIGHT * 0.65 : 0,
        }),
        If(eventPromptIndexDatum, eventPromptIndex => {
            const eventPromptText = event.prompts[eventPromptIndex]
            const eventPostChoiceText =
                event.choices[choiceDatum.val?.index ?? -1]?.postPrompts[
                    eventPromptIndex - event.prompts.length - 1
                ]

            if (eventPromptText || eventPostChoiceText)
                return Prompt(eventPromptText || eventPostChoiceText)
            else if (eventPromptIndex === event.prompts.length)
                return Choices(event, choiceDatum, eventPromptIndexDatum)
            else if (choiceDatum.val != null) {
                callApi('chooseEventResponse', choiceDatum.val)
                return Container({})
            } else throw new Error('BAD BAD NO CLEAR CHOICE!!')
        }),
        SouvenirsEls()
    )
}

const style: Partial<TextStyle> = {
    fontFamily: fontMap['sansFont'],
    fontSize: 32,
    fill: 'white',
    wordWrap: true,
    wordWrapWidth: BASE_WIDTH * 0.9,
    align: 'center',
    lineHeight: 65,
}

function Prompt(text: string) {
    return Text({
        text,
        style,
        anchor: [0.5, 0],
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * 0.75,
    })
}

function Choices(
    eventScene: EventScene,
    choiceDatum: Datum<null | EventResponse>,
    eventPromptIndexDatum: Datum<number>
) {
    const isChoosingCharacter = datum(false)

    return If(
        isChoosingCharacter,
        () =>
            EquipSouvenirInterface(
                souvenirMap[
                    eventScene.choices[choiceDatum.val?.index!].souvenirId!
                ],
                choiceDatum,
                eventPromptIndexDatum
            ),
        () =>
            ChooseOptionInterface(
                eventScene,
                choiceDatum,
                eventPromptIndexDatum,
                isChoosingCharacter
            )
    )
}

function ChooseOptionInterface(
    eventScene: EventScene,
    choiceDatum: Datum<EventResponse | null>,
    eventPromptIndexDatum: Datum<number>,
    isChoosingCharacter: Datum<boolean>
) {
    const choiceAssetTexts = eventScene.choices.map(c => c.text)
    // const choiceAssetKeys = keys(eventAssets).filter(k =>
    //     k.includes(`${upperFirst(eventScene.id)}Choice`)
    // )

    return Container(
        {},
        ...choiceAssetTexts.map((choiceAssetText, index) => {
            const isHovered = datum(false)

            const souvenirId = eventScene.choices[index]?.souvenirId
            const souvenir = souvenirId ? souvenirMap[souvenirId] : null
            const fontSize = 26
            const lineHeight = 55

            const text = Text({
                text: choiceAssetText,
                style: {
                    ...style,
                    fontSize,
                    lineHeight,
                    wordWrapWidth: (BASE_WIDTH / choiceAssetTexts.length) * 0.8,
                },
                anchor: [0.5, 0],
                y: 40,
            })

            return Container(
                {
                    x:
                        (BASE_WIDTH * (1 + index * 2)) /
                        choiceAssetTexts.length /
                        2,
                    y: BASE_HEIGHT * 0.72,
                },
                RoundedRectangleGradientSprite({
                    radius: 50,
                    gradientArgs: {
                        x0: 0,
                        y0: 0,
                        x1: 0,
                        y1: text.height * 1.2,
                        colorStops: [
                            { color: 0x3d3b35, offset: 0 },
                            { color: 0x2b2b2b, offset: 1 },
                        ],
                    },
                    spriteArgs: {
                        width:
                            (BASE_WIDTH / choiceAssetTexts.length) * 0.8 +
                            30 * 2,
                        height: text.height + lineHeight * 1.4,
                        anchor: [0.5, 0],
                        events: {
                            pointerenter() {
                                isHovered.set(true)
                            },
                            pointerleave() {
                                isHovered.set(false)
                            },
                            pointerup() {
                                choiceDatum.set({ index })

                                if (!souvenir?.equippable) {
                                    eventPromptIndexDatum.set(
                                        eventPromptIndexDatum.val + 1
                                    )
                                } else {
                                    isChoosingCharacter.set(true)
                                }
                            },
                        },
                    },
                }),
                text,
                ExplanationIf({
                    isShown: isHovered,
                    texts: souvenir
                        ? [souvenir.name, souvenir.description]
                        : ["(You don't gain any souvenirs)"],
                    xOffset: (-TEXT_WIDTH * explanationScale) / 2,
                    yOffset: -BASE_HEIGHT * 0.3,
                    isHtml: true,
                    displayArgs: { scale: explanationScale },
                })
            )
        })
    )
}

export function EquipSouvenirInterface(
    souvenir: Souvenir,
    choiceDatum: Datum<null | EventResponse>,
    eventPromptIndexDatum?: Datum<number>
): DisplayObject {
    const souvenirWidth = 300

    return Container(
        {},
        Sprite({
            src: Texture.WHITE,
            tint: 0,
            alpha: 0.8,
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
        }),
        Text({
            text: 'Choose a Kaiju to Receive:',
            style: {
                fontSize: 40,
                fontFamily: fontMap['sansFont'],
                fill: 'white',
            },
            anchor: 0.5,
            x: BASE_WIDTH * 0.5,
            y: BASE_HEIGHT * 0.4,
        }),
        Adjust(
            SouvenirEl({
                souvenir,
                width: souvenirWidth,
                displayArgs: {
                    filters: [glowFilter],
                },
                explanationDisplayArgs: {
                    scale: explanationScale,
                    y: -50,
                    x: 50,
                },
            }),
            {
                x: BASE_WIDTH * 0.5 + souvenirWidth / 2,
                y: BASE_HEIGHT * 0.2,
            }
        ),
        ...CharacterChoices(choiceDatum, eventPromptIndexDatum),
        BattleSceneCharacterInfo()
    )
}

function CharacterChoices(
    choiceDatum: Datum<null | EventResponse>,
    eventPromptIndexDatum?: Datum<number>
) {
    return vals(getBattleScene().get('allCharacters'))
        .filter(cm => cm.isPc && cm.health > 0)
        .map((characterMeta, index) => {
            return Adjust(
                MainCharacterAnimation({
                    characterMeta,
                    events: {
                        pointerup() {
                            choiceDatum.set({
                                index: choiceDatum.val?.index!,
                                characterUid: characterMeta.uid,
                            })
                            eventPromptIndexDatum &&
                                eventPromptIndexDatum.set(
                                    eventPromptIndexDatum.val + 1
                                )
                        },
                    },
                })!,
                {
                    x: BASE_WIDTH * 0.2 + index * BASE_WIDTH * 0.6 * 0.5,
                    y: BASE_HEIGHT * 0.8,
                }
            )
        })
}

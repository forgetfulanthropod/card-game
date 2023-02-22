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
    EventAssetKey,
    eventAssets,
    getTexture,
    glowFilter,
    If,
    loopSong,
    PixiContainer,
    Sprite,
    Text,
} from '@/elementsUtil'
import { compose, Datum, datum } from 'datums'
import { upperFirst } from 'lodash'
import { KawaseBlurFilter } from 'pixi-filters'
import { Texture } from 'pixi.js'
import { CharacterUid, EventScene, Souvenir, souvenirMap } from 'shared'
import { keys, vals } from 'shared/code'
import { SpineBackground } from '../background'
import {
    BattleSceneCharacterInfo,
    ExplanationIf,
    MainCharacterAnimation,
    TEXT_WIDTH,
} from '../shared'
import { SouvenirEl, SouvenirsEls } from './Souvenirs'

type EventResponse = { index: number; characterUid?: CharacterUid }

const explanationScale = 1.5

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
    const eventPromptKeys = keys(eventAssets).filter(k =>
        k.includes(`${eventIdUpperFirst}Prompt`)
    )

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

    return Container(
        {
            onDestroy: [
                eventPromptIndexDatum.onChange(index => {
                    if (index === eventPromptKeys.length)
                        eventGradient.interactive = false

                    if (index > eventPromptKeys.length)
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
            src: `event${eventIdUpperFirst}MainGraphic` as AssetKey,
            scale:
                (BASE_HEIGHT * 0.5) /
                getTexture(`event${eventIdUpperFirst}MainGraphic` as AssetKey)
                    .height,
            anchor: [0.5, 1],
            x: BASE_WIDTH / 2,
            y: BASE_HEIGHT * 0.65,
        }),
        If(eventPromptIndexDatum, eventPromptIndex => {
            const eventPromptKey = eventPromptKeys[eventPromptIndex]
            const eventPostChoiceKeys = keys(eventAssets).filter(k =>
                k.includes(
                    `${eventIdUpperFirst}PostChoice${
                        (choiceDatum.val?.index ?? 0) + 1
                    }_`
                )
            )
            const eventPostChoiceKey =
                eventPostChoiceKeys[
                    eventPromptIndex - eventPromptKeys.length - 1
                ]

            if (eventPromptKey || eventPostChoiceKey)
                return PromptSprite(eventPromptKey || eventPostChoiceKey)
            else if (eventPromptIndex === eventPromptKeys.length)
                return Choices(event, choiceDatum, eventPromptIndexDatum)
            else if (choiceDatum.val != null) {
                callApi('chooseEventResponse', choiceDatum.val)
                return Container({})
            } else throw new Error('BAD BAD NO CLEAR CHOICE!!')
        }),
        SouvenirsEls()
    )
}

function PromptSprite(eventPromptKey: EventAssetKey) {
    return Sprite({
        src: eventPromptKey,
        anchor: [0.5, 0],
        scale: 0.5,
        // scale: (BASE_WIDTH * 0.6) / getTexture(eventPromptKey).width,
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
    const choiceAssetKeys = keys(eventAssets).filter(k =>
        k.includes(`${upperFirst(eventScene.id)}Choice`)
    )

    return Container(
        {},
        ...choiceAssetKeys.map((choiceAssetKey, index) => {
            const isHovered = datum(false)

            const souvenirId = eventScene.choices[index]?.souvenirId
            const souvenir = souvenirId && souvenirMap[souvenirId]

            return Container(
                {
                    x:
                        (BASE_WIDTH * (1 + index * 2)) /
                        choiceAssetKeys.length /
                        2,
                    y: BASE_HEIGHT * 0.7,
                },
                Sprite({
                    src: choiceAssetKey,
                    anchor: [0.5, 0],
                    scale: 0.5,
                    events: {
                        pointerover() {
                            isHovered.set(true)
                        },
                        pointerout() {
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
                }),
                ...(souvenir
                    ? [
                          ExplanationIf({
                              isShown: isHovered,
                              texts: [souvenir.name, souvenir.description],
                              xOffset: (-TEXT_WIDTH * explanationScale) / 2,
                              yOffset: -BASE_HEIGHT * 0.3,
                              isHtml: true,
                              displayArgs: { scale: explanationScale },
                          }),
                      ]
                    : [])
            )
        })
    )
}

function EquipSouvenirInterface(
    souvenir: Souvenir,
    choiceDatum: Datum<null | EventResponse>,
    eventPromptIndexDatum: Datum<number>
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
                fontFamily: 'sansFont',
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
    eventPromptIndexDatum: Datum<number>
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

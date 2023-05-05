import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    fontMap,
    getTexture,
    glowFilter,
    If,
    InteractionEvents,
    loopSong,
    PixiContainer,
    Sprite,
    Text,
} from '@/elementsUtil'
import { compose, Datum, datum } from 'datums'
import { upperFirst } from 'lodash'
import {
    CharacterUid,
    EventChoice,
    EventScene,
    Souvenir,
    souvenirMap,
} from 'shared'
import { EquipSouvenirInterface } from './EquipSouvenirInterface'
import { SouvenirsEls } from './Souvenirs'

export type EventResponse = { index: number; characterUid?: CharacterUid }

export const explanationScale = 1

export function EventSceneEl(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Event Scene' })

    loopSong('eventSceneMusicHooligansBluff')

    const event = getBattleScene().get('currentRoom', 'event')

    if (event == null)
        throw new Error('trying to render event scene without event ID')

    const newSouvenirsDatum = datum<Souvenir[]>([])

    return Container(
        {},
        // Adjust(
        //     SpineBackground({
        //         srcs: ['hooligansBluffBg1_0', 'hooligansBluffBg1_1'],
        //     }),
        //     {
        //         filters: [new KawaseBlurFilter(1)],
        //     }
        // ),
        Frame(),
        Graphic(event),
        Banner(event),
        SouvenirsEls(newSouvenirsDatum),
        TextAndButtons(event, newSouvenirsDatum)
    )
}

function Frame() {
    return Sprite({
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * 0.52,
        anchor: 0.5,
        src: 'eventFrame',
    })
}

function Banner(event: EventScene) {
    // const curveRadius = getTexture('eventBanner').width * 2
    return Container(
        {
            x: BASE_WIDTH * 0.3,
            y: BASE_HEIGHT * 0.12,
        },
        Sprite({
            src: 'eventBanner',
            anchor: 0.5,
        }),
        // Adjust(
        //     CurvedText({
        //         text:
        Text({
            text: event.title ?? 'An Event Title Here',
            anchor: [0.5, 0.5],
            style: {
                fontSize: 40,
                fontFamily: fontMap['bigFont'],
                fill: 'white',
            },
        })
        //         radius: curveRadius,
        //         maxWidth: Number.MAX_SAFE_INTEGER,
        //     }),
        //     { y: curveRadius * 0.99 }
        // )
    )
}

function Graphic(event: EventScene) {
    const eventId = event?.id
    const eventIdUpperFirst = upperFirst(eventId)
    const src = getTexture(`event${eventIdUpperFirst}MainGraphic` as AssetKey)

    return Container(
        {
            x: BASE_WIDTH * 0.3,
            y: BASE_HEIGHT * 0.52,
        },
        Sprite({ src: 'eventGraphicBackdrop', anchor: [0.5, 0.5] }),
        Sprite({
            src,
            anchor: [0.5, 0.5],
            scale: src.height > 1080 ? 0.25 : 0.5,
        })
    )
}

function TextAndButtons(
    event: EventScene,
    newSouvenirsDatum: Datum<Souvenir[]>
) {
    let cumulativeButtonHeight = 0

    const selectedChoice = datum<null | EventResponse>(null)
    const isChoosingCharacter = datum(false)
    const showPostResponsePrompts = datum(false)
    const x = BASE_WIDTH * 0.55
    const y = BASE_HEIGHT * 0.2

    return Container(
        { x, y },
        If(
            showPostResponsePrompts,
            () => {
                const souvenir =
                    souvenirMap[
                        event.choices[selectedChoice.val!.index]?.souvenirId!
                    ]
                if (souvenir) newSouvenirsDatum.set([souvenir])

                return Container(
                    {},
                    Text({
                        animateInS: 2,
                        text:
                            event.choices[selectedChoice.val!.index].text +
                            '\n\n' +
                            event.choices[selectedChoice.val!.index].postPrompts
                                .map(prompt => prompt)
                                .join('\n\n'),
                        style: {
                            wordWrap: true,
                            wordWrapWidth: BASE_WIDTH * 0.35,
                            fontFamily: fontMap['sansFont'],
                            fill: 'white',
                            fontSize: 25,
                        },
                    }),
                    Adjust(
                        ChoiceButton({
                            text: '[Leave]',
                            events: {
                                pointerup() {
                                    callApi(
                                        'chooseEventResponse',
                                        selectedChoice.val!
                                    )
                                    newSouvenirsDatum.set([])
                                },
                            },
                        }),
                        { y: BASE_HEIGHT * 0.62 }
                    )
                    // ...(souvenirId
                    //     ? [
                    //           Sprite({
                    //               src: `souvenir${upperFirst(
                    //                   souvenirId
                    //               )}` as SouvenirAssetKey,
                    //               width: 150,
                    //               height: 150,
                    //               anchor: 0.5,
                    //               x: -BASE_WIDTH * 0.5,
                    //               y: -BASE_HEIGHT * 0.07,
                    //               filters: [glowFilter],
                    //           }),
                    //       ]
                    //     : [])
                )
            },
            () =>
                Container(
                    {},
                    Text({
                        animateInS: 2,
                        text: event.prompts.map(prompt => prompt).join('\n\n'),
                        style: {
                            wordWrap: true,
                            wordWrapWidth: BASE_WIDTH * 0.35,
                            fontFamily: fontMap['sansFont'],
                            fill: 'white',
                            fontSize: 25,
                        },
                    }),
                    ...[...event.choices].reverse().map((c, index) => {
                        return BoundChoiceButton(
                            c,
                            event.choices.length - 1 - index
                        )
                    })
                )
        ),
        If(
            compose(
                ([isChoosing, postResponse]) => isChoosing && !postResponse,
                isChoosingCharacter,
                showPostResponsePrompts
            ),
            () =>
                Adjust(
                    EquipSouvenirInterface(
                        souvenirMap[
                            event.choices[selectedChoice.val!.index].souvenirId!
                        ],
                        selectedChoice,
                        showPostResponsePrompts
                    ),
                    { x: -x, y: -y }
                )
        )
    )

    function BoundChoiceButton(eventChoice: EventChoice, index: number) {
        const souvenir = eventChoice.souvenirId
            ? souvenirMap[eventChoice.souvenirId]
            : null

        const isHovered = datum(false)
        const button = ChoiceButton({
            text: souvenir
                ? `[${souvenir.name}]<br><span style="color: #1EFF00">${souvenir.description}</span>`
                : `[skip]`,
            events: {
                pointerenter() {
                    isHovered.set(true)
                },
                pointerleave() {
                    isHovered.set(false)
                },
                pointerup() {
                    selectedChoice.set({ index })

                    if (!souvenir?.equippable) {
                        showPostResponsePrompts.set(true)
                    } else {
                        isChoosingCharacter.set(true)
                    }
                },
            },
        })
        const root = Container(
            {
                y:
                    BASE_HEIGHT * 0.7 -
                    cumulativeButtonHeight -
                    button.height / 2,
            },
            button,
            ...(souvenir
                ? [
                      If(isHovered, () =>
                          Sprite({
                              src: `souvenir${upperFirst(
                                  souvenir?.id
                              )}` as AssetKey,
                              width: 150,
                              height: 150,
                              anchor: [1.1, 0.5],
                              filters: [glowFilter],
                          })
                      ),
                  ]
                : [])
        )

        cumulativeButtonHeight += root.height + 6

        return root
    }
}

function ChoiceButton({
    text,
    events,
}: {
    text: string
    events: InteractionEvents
}) {
    const fontSize = 20
    const textEl = Text({
        text,
        isHtml: true,
        anchor: [0, 0.5],
        x: 6,
        style: {
            wordWrap: true,
            wordWrapWidth: BASE_WIDTH * 0.36,
            fontFamily: fontMap['sansFont'],
            fill: 'white',
            fontSize,
        },
    })

    const numLines = Math.round(textEl.height / fontSize / 1.5) as 1 | 2 | 3
    const src = getTexture(`eventChoiceButton${numLines}`)

    return Container(
        {
            events,
        },
        Sprite({
            src,
            anchor: [0.03, 0.5],
            scale: 0.9,
        }),
        textEl
    )
}

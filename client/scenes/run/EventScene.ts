import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    EventAssetKey,
    eventAssets,
    getTexture,
    If,
    PixiContainer,
    Sprite,
} from '@/elementsUtil'
import { datum } from 'datums'
import { upperFirst } from 'lodash'
import { KawaseBlurFilter } from 'pixi-filters'
import { EventScene, souvenirMap } from 'shared'
import { keys } from 'shared/code'
import { SpineBackground } from '../background'
import { ExplanationIf, TEXT_WIDTH } from '../shared'

export function EventScene(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Event Scene' })
    const eventPromptIndexDatum = datum(0)
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
                if (eventPromptIndexDatum.val < eventPromptKeys.length)
                    eventPromptIndexDatum.set(eventPromptIndexDatum.val + 1)

                if (eventPromptIndexDatum.val >= eventPromptKeys.length)
                    eventGradient.interactive = false
            },
        },
    })

    return Container(
        {},
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

            if (eventPromptKey) return PromptSprite(eventPromptKey)
            else return Choices(event)
        })
    )
}

function PromptSprite(eventPromptKey: EventAssetKey) {
    return Sprite({
        src: eventPromptKey,
        anchor: [0.5, 1],
        scale: (BASE_WIDTH * 0.6) / getTexture(eventPromptKey).width,
        x: BASE_WIDTH / 2,
        y: BASE_HEIGHT * 0.9,
    })
}

function Choices(eventScene: EventScene) {
    const choiceAssetKeys = keys(eventAssets).filter(k =>
        k.includes(`${upperFirst(eventScene.id)}Choice`)
    )
    console.log({ choiceAssetKeys })

    return Container(
        {},
        ...choiceAssetKeys.map((choiceAssetKey, index) => {
            const isHovered = datum(false)

            const souvenirId = eventScene.choices[index]?.souvenirId
            const souvenir = souvenirId && souvenirMap[souvenirId]

            console.log({ souvenir })

            return Container(
                {
                    x:
                        (BASE_WIDTH * (1 + index * 2)) /
                        choiceAssetKeys.length /
                        2,
                    y: BASE_HEIGHT * 0.9,
                },
                Sprite({
                    src: choiceAssetKey,
                    anchor: [0.5, 1],
                    scale:
                        (BASE_WIDTH * 0.8) /
                        choiceAssetKeys.length /
                        getTexture(choiceAssetKey).width,
                    events: {
                        pointerover() {
                            isHovered.set(true)
                        },
                        pointerout() {
                            isHovered.set(false)
                        },
                        pointerup() {
                            callApi('chooseEventResponse', { index })
                        },
                    },
                }),
                ...(souvenir
                    ? [
                          ExplanationIf({
                              isShown: isHovered,
                              texts: [souvenir.name, souvenir.description],
                              xOffset: -TEXT_WIDTH / 2,
                              yOffset: -BASE_HEIGHT * 0.5,
                              isHtml: true,
                          }),
                      ]
                    : [])
            )
        })
    )
}

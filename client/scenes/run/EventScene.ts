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
import { EventId } from 'shared'
import { keys } from 'shared/code'
import { SpineBackground } from '../background'

export function EventScene(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Event Scene' })
    const eventPromptIndexDatum = datum(0)
    const eventId = getBattleScene().get('currentRoom', 'event')?.id

    if (eventId == null)
        throw new Error('trying to render event scene without event ID')

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
            else return Choices(eventId)
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

function Choices(eventId: EventId) {
    const choiceAssetKeys = keys(eventAssets).filter(k =>
        k.includes(`${upperFirst(eventId)}Choice`)
    )
    console.log({ choiceAssetKeys })

    return Container(
        {},
        ...choiceAssetKeys.map((choiceAssetKey, index) =>
            Sprite({
                src: choiceAssetKey,
                anchor: [0.5, 1],
                scale:
                    (BASE_WIDTH * 0.8) /
                    choiceAssetKeys.length /
                    getTexture(choiceAssetKey).width,
                x: (BASE_WIDTH * (1 + index * 2)) / choiceAssetKeys.length / 2,
                y: BASE_HEIGHT * 0.9,
                events: {
                    pointerup() {
                        callApi('chooseEventResponse', { index })
                    },
                },
            })
        )
    )
}

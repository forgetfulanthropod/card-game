import type { ColorStop } from '@pixi-essentials/gradients'
import { Tweener } from 'pixi-tweener'
import type { DisplayObject, InteractionEvent } from 'pixi.js'
import { Texture } from 'pixi.js'
import type { Card, CardType, CardUid, CharacterUid } from 'shared'
import type { Datum } from 'datums'
import { datum } from 'datums'
import { startCase, upperFirst } from 'lodash'
import { keys } from 'shared/code'
import {
    ExplanationBox,
    keyTermsMap,
    TermExplanationBox,
} from '../ExplanationBox'
import { beginTargetSelection } from './beginTargetSelection'
import { getCardTypeTexture } from './getCardTypeSrc'
import { hoveredCharacterUid } from '@/util'
import type {
    InteractionEventHandler,
    InteractionEvents,
    PixiText,
    PixiTexture,
    PixiSprite,
    TweenablePixiContainer,
} from '@/elementsUtil'
import {
    portalize,
    BASE_WIDTH,
    BASE_HEIGHT,
    flashTo,
    getStage,
    getTexture,
    Container,
    getRenderer,
    PixiContainer,
    Sprite,
    Text,
    TweenableContainer,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/callApi'
import type { CardTypeAssetId } from '@/assets'

const cardTypeToColorMap: Record<CardTypeAssetId, number[]> = {
    cardTypeAttack: [0xfff4d8, 0xfff0d2, 0xffbe79, 0xf36919, 0xdf0100],
    cardTypeDefense: [0xfef3d7, 0xe5f8e1, 0x5df6fd, 0x00b6fc, 0x0012de],
    cardTypeUtility: [0xfff4d8, 0xf3f5ce, 0x9eff87, 0x42f93a, 0x1be515],
    cardTypeEnchantment: [0xfef3d7, 0xffee98, 0xfedc41, 0xf2b90d, 0xdf8e01],
}

export function CardEl({
    rotation,
    width,
    card,
    hoveredCardUid,
    events,
    omitPointerAreaExtender,
}: {
    rotation?: number
    width: number
    card: Card
    hoveredCardUid?: Datum<CharacterUid | null>
    events?: InteractionEvents
    omitPointerAreaExtender?: boolean
}): TweenablePixiContainer {
    const cardFrameTexture = getCardTypeTexture(card.type)

    if (card.type == null) return TweenableContainer({}, TweenableContainer({}))

    // console.log({ cardType: card.type, cardFrameTexture })

    const colorStops = getColorStopsFromCardType(card.type)
    const scale = width / cardFrameTexture.width

    let cardArtTexture
    let cardArtTextureOrBlank
    try {
        const cardId = card.id.includes('block') ? 'block' : card.id
        cardArtTextureOrBlank = cardArtTexture = getTexture(
            `card${upperFirst(cardId)}`
        )
    } catch {
        cardArtTextureOrBlank = Texture.WHITE
    }

    const isLongHovered = datum(false)
    const decoratedEvents: InteractionEvents = getDecoratedEvents({
        events,
        hoveredCardUid,
        card,
        isLongHovered,
    })

    const root = TweenableContainer(
        {
            name: card.uid,
            // cache: true, // doesn't update...
        },
        TweenableContainer(
            {
                events: decoratedEvents,
                rotation,
                scale,
                y: (cardFrameTexture.height / 2) * scale,
            },
            // getGradientBackground(cardFrameTexture, colorStops),
            Sprite({
                src: cardArtTextureOrBlank,
                tint: cardArtTexture ? undefined : 0,
                width: getTexture('cardBlock').width,
                height: getTexture('cardBlock').height,
                anchor: [0.5, 0.85],
            }),
            Sprite({
                src: 'cardBase',
                anchor: 0.5,
            }),
            Sprite({
                src: cardFrameTexture,
                anchor: 0.5,
            }),
            getEnergyContainer(card),
            ...getTexts(card, cardFrameTexture, colorStops),
            ...(omitPointerAreaExtender
                ? []
                : [
                      PointerAreaExtender(
                          cardFrameTexture.width,
                          cardFrameTexture.height
                      ),
                  ])
        )
    )

    manageExplanationsEl(root, ExplanationsEl(card, width), isLongHovered)

    return root
}

function ExplanationsEl(card: Card, width: number) {
    return Container(
        {
            // x: BASE_WIDTH / 2,
            // y: BASE_HEIGHT * 0.6,
            name: 'MY EXPLANATIONS',
        },
        ...TermExplanationBoxes(card.explanation, width)
    )
}

function getDecoratedEvents({
    events,
    hoveredCardUid,
    card,
    isLongHovered,
}: {
    events: InteractionEvents | undefined
    hoveredCardUid: Datum<CharacterUid | null> | undefined
    card: Card
    isLongHovered: Datum<boolean>
}) {
    const isHovering = datum(false)

    const dynamicEvents =
        events ?? (hoveredCardUid ? getEvents(card, hoveredCardUid) : {})

    const decoratedEvents: InteractionEvents = {
        ...dynamicEvents,
        pointerover(e) {
            dynamicEvents?.pointerover?.(e)

            isHovering.set(true)
            setTimeout(() => {
                if (isHovering.val) isLongHovered.set(true)
            }, 1000)
        },
        pointerdown(e) {
            dynamicEvents?.pointerdown?.(e)

            isHovering.set(true)
            setTimeout(() => {
                if (isHovering.val) isLongHovered.set(true)
            }, 1000)
        },
        pointerout(e) {
            dynamicEvents?.pointerout?.(e)

            isHovering.set(false)
            isLongHovered.set(false)
        },
    }
    return decoratedEvents
}

function manageExplanationsEl(
    root: TweenablePixiContainer,
    explanationsEl: PixiContainer,
    isLongHovered: Datum<boolean>
) {
    isLongHovered.onChange(is => {
        if (!is) {
            explanationsEl.alpha = 0
            return
        }

        portalize({
            from: root,
            to: () => getStage(),
            content: explanationsEl,
        })

        const rootPosition = root.getGlobalPosition()
        explanationsEl.x = rootPosition.x
        explanationsEl.y = rootPosition.y
        explanationsEl.alpha = 1
    })
}

function TermExplanationBoxes(
    explanation: string,
    width: number
): DisplayObject[] {
    const allKeyTerms = keys(keyTermsMap)
    const terms = allKeyTerms
        .filter(keyTerm => ~getIndex(keyTerm, explanation))
        .sort(
            (keyTermA, keyTermB) =>
                getIndex(keyTermA, explanation) -
                getIndex(keyTermB, explanation)
        )

    const boxes = terms.map(term =>
        TermExplanationBox({ term, displayObjectArgs: { x: width * 0.85 } })
    )

    boxes.forEach((box, i) => {
        if (i > 0) {
            const lastBox = boxes[i - 1]
            box.y = lastBox.y + lastBox.height + 10
        }

        return box
    })

    return boxes
}

function getIndex(term: string, explanation: string): number {
    return explanation.toLowerCase().indexOf(startCase(term).toLowerCase())
}

export function CardSprite({
    rotation,
    width,
    card,
    hoveredCardUid,
    events,
    omitPointerAreaExtender,
}: {
    rotation?: number
    width: number
    card: Card
    hoveredCardUid?: Datum<CharacterUid | null>
    events?: InteractionEvents
    omitPointerAreaExtender?: boolean
}): PixiSprite {
    const el = CardEl({
        rotation,
        width,
        card,
        hoveredCardUid,
        events,
        omitPointerAreaExtender,
    })
    const src = getRenderer().generateTexture(el)
    // nextTick().then(() => el.destroy(true))
    return Sprite({ src, onDestroy: [() => el.destroy(true)] })
}

function PointerAreaExtender(width: number, height: number): PixiContainer {
    return Container(
        {},
        Sprite({
            src: Texture.WHITE,
            width,
            height,
            alpha: 0,
            anchor: [0.5, 0],
        })
    )
}

// function getGradientBackground(
//     cardFrameTexture: PixiTexture,
//     colorStops: ColorStop[]
// ) {
//     return RoundedRectangleGradientSprite({
//         radius: cardFrameTexture.width / 15,
//         gradientArgs: {
//             x0: 0,
//             y0: 0,
//             x1: 0,
//             y1: cardFrameTexture.height,
//             colorStops,
//         },
//         spriteArgs: {
//             width: cardFrameTexture.width,
//             height: cardFrameTexture.height,
//             anchor: 0.5,
//         },
//     })
// }

// function getCardFrameSprite(cardFrameTexture: PixiTexture) {
//     return Sprite({
//         src: cardFrameTexture,
//         anchor: 0.5,
//     })
// }

function getEnergyContainer(card: Card): PixiContainer {
    return Container(
        {},
        Sprite({
            src: 'cardEnergy',
            anchor: 0.5,
        }),
        Sprite({
            src: `cardEnergy${card.energy}`,
            anchor: 0.5,
        })
    )
}

function getTexts(
    card: Card,
    cardFrameTexture: PixiTexture,
    colorStops: ColorStop[]
): PixiText[] {
    const { marginH, marginV } = getMargins(cardFrameTexture)

    const cardFrameScale = cardFrameTexture.width / 791

    return [
        Text({
            text: card.name,
            y: -cardFrameTexture.height / 2 + marginV,
            anchor: [0.5, 0.2],
            style: {
                fontSize: 54 * cardFrameScale,
                fontFamily: 'bigFont',
                fill: 'white',
                stroke: 'black',
                strokeThickness: 6 * cardFrameScale,
                lineHeight: 0,
            },
        }),
        Text({
            text: `<div style="font-family: sans-serif; padding: 4px">${upperFirst(
                card.explanation
            )}</div>`,
            isHtml: true,
            x: -cardFrameTexture.width / 2 + marginH,
            y: cardFrameTexture.height * 0.15,
            style: {
                wordWrap: true,
                wordWrapWidth: cardFrameTexture.width - marginH * 2,
                fontSize: 40 * cardFrameScale,
                fontFamily: 'monoFont',
                fill: 'black',
                lineHeight: 40 * cardFrameScale,
            },
        }),
        Text({
            text: card.characterClass,
            y: cardFrameTexture.height * 0.4,
            anchor: 0.5,
            style: {
                fontSize: 40 * cardFrameScale,
                fontFamily: 'sansFont',
                fill: colorStops[0].color,
                stroke: 'black',
                strokeThickness: 8,
                letterSpacing: 3 * cardFrameScale,
            },
        }),
    ]
}

function getMargins(cardFrameTexture: PixiTexture) {
    const marginH = cardFrameTexture.width * 0.2
    const marginV = cardFrameTexture.width * 0.12
    return { marginH, marginV }
}

function getColorStopsFromCardType(cardType: CardType): ColorStop[] {
    const bgGradientColors =
        //@ts-expect-error
        cardTypeToColorMap[`cardType${upperFirst(cardType)}`] as number[]

    return bgGradientColors.map(
        (color, i): ColorStop => ({
            color,
            offset: i / bgGradientColors.length,
        })
    )
}

let clearLastTargetSelection = () => {}
function getEvents(
    card: Card,
    hoveredCardUid: Datum<CardUid | null>
): InteractionEvents {
    const pointerover: InteractionEventHandler = () => {
        hoveredCharacterUid.set(card.characterUid)
        hoveredCardUid.set(card.uid)
    }
    const pointerout: InteractionEventHandler = () => {
        setTimeout(() => {
            if (hoveredCardUid.val === card.uid) {
                hoveredCardUid.set(null)
                hoveredCharacterUid.set(null)
            }
        }, 0)
    }
    const pointerdown: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        //for mobile
        pointerover({
            currentTarget: cardEl,
        } as InteractionEvent)

        if (!(cardEl instanceof PixiContainer))
            throw new Error('ERROR! should be bound to container')

        clearLastTargetSelection()

        if (getBattleScene().get().energy >= card.energy) {
            if (card.targetType !== 'self')
                clearLastTargetSelection = beginTargetSelection(
                    cardEl.parent,
                    card
                )
        } else {
            flashTo(
                getStage(),
                () =>
                    ExplanationBox({
                        texts: ['not enough energy!'],
                        displayObjectArgs: {
                            x: BASE_WIDTH / 2,
                            y: BASE_HEIGHT * 0.6,
                            borderThickness: 3,
                        },
                        color: 0xa240e8,
                    }),
                { durationMs: 1200 }
            )
        }
    }
    const pointerup: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        if (card.targetType === 'self') {
            // console.log('Card.ts: playing card')

            void callApi('playCard', {
                cardUid: card.uid,
                targetUids: [],
            })
        }
        //for mobile
        else
            pointerout({
                currentTarget: cardEl,
            } as InteractionEvent)
    }

    // todo: detect pointermove for mobile to begin target selection..
    // const pointermove: InteractionEventHandler = function (e) {
    //     console.log({ e })
    //     // if (hasMovedEnough) pointerdown
    // }

    return {
        pointerover,
        pointerout,
        pointerdown,
        pointerup,
        // pointermove,
    }
}

export function getNullAnimation() {
    return Tweener.add({ target: {}, duration: 0 }, {})
}

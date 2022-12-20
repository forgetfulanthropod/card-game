import type { ColorStop } from '@pixi-essentials/gradients'
import { Tweener } from 'pixi-tweener'
import type { DisplayObject, InteractionEvent } from 'pixi.js'
import { Texture } from 'pixi.js'
import type { Card, CardType, CardUid, CharacterUid, TargetType } from 'shared'
import type { Datum } from 'datums'
import { datum } from 'datums'
import { startCase, upperFirst } from 'lodash'
import { keys } from 'shared/code'
import {
    Explanation,
    getTermIndex,
    keyTermsMap,
    TermExplanationsIf,
} from '../Explanation'
import { beginTargetSelection } from './beginTargetSelection'
import { getCardTypeTexture } from './getCardTypeSrc'
import { hoveredCharacterUid } from '@/util'
import {
    InteractionEventHandler,
    InteractionEvents,
    PixiText,
    PixiTexture,
    PixiSprite,
    TweenablePixiContainer,
    CurvedText,
    Adjust,
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
import type { AssetKey, CardTypeAssetId } from '@/assets'

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
    try {
        const cardId = card.id.includes('block') ? 'block' : card.id

        cardArtTexture = getTexture(
            `card${
                cardId.indexOf('basicAttack') === 0
                    ? 'Attack'
                    : upperFirst(cardId)
            }` as AssetKey
        )
    } catch {
        cardArtTexture = getTexture('cardArtPlaceholder')
    }

    const isLongHovered = datum(false)
    const decoratedEvents: InteractionEvents = getDecoratedEvents({
        events,
        hoveredCardUid,
        isLongHovered,
        card,
    })

    const root = TweenableContainer(
        {
            name: card.uid,
            onDestroy: !hoveredCardUid
                ? []
                : [
                      hoveredCardUid.onChange(uid => {
                          if (uid !== card.uid) isLongHovered.set(false)
                      }),
                  ],
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
                src: cardArtTexture,
                // tint: cardArtTexture ? undefined : 0,
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
            getCardOwnerToken(card),
            ...getTexts(card, cardFrameTexture, colorStops),
            ...(omitPointerAreaExtender
                ? []
                : [
                      PointerAreaExtender(
                          cardFrameTexture.width,
                          cardFrameTexture.height
                      ),
                  ])
        ),
        TermExplanationsForCard(card.explanation, width, isLongHovered)
    )

    return root
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
            }, 800)
        },
        pointerdown(e) {
            dynamicEvents?.pointerdown?.(e)

            isHovering.set(true)
            setTimeout(() => {
                if (isHovering.val) isLongHovered.set(true)
            }, 800)
        },
        pointerout(e) {
            dynamicEvents?.pointerout?.(e)

            isHovering.set(false)
            isLongHovered.set(false)
        },
    }
    return decoratedEvents
}

function TermExplanationsForCard(
    explanation: string,
    width: number,
    isLongHovered: Datum<boolean>
): DisplayObject {
    const allKeyTerms = keys(keyTermsMap)
    const terms = allKeyTerms
        .filter(keyTerm => ~getTermIndex(keyTerm, explanation))
        .sort(
            (keyTermA, keyTermB) =>
                getTermIndex(keyTermA, explanation) -
                getTermIndex(keyTermB, explanation)
        )

    return TermExplanationsIf({
        areShown: isLongHovered,
        terms,
        xOffset: width * 0.77,
    })
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

function getEnergyContainer(card: Card): PixiContainer {
    return Container(
        {},
        Sprite({
            src: 'cardEnergy',
            anchor: 0.5,
        }),
        Sprite({
            src: `cardEnergy${card.energy}` as AssetKey,
            anchor: 0.5,
        })
    )
}

function getCardOwnerToken(card: Card): PixiContainer {
    const cm = getBattleScene().get('allCharacters', card.characterUid)

    const src = getTexture(`cardOwnerToken${upperFirst(cm.id)}` as AssetKey)

    if (src == null) console.error("couldn't find the token")

    return Container(
        {},
        ...(src
            ? [
                  Sprite({
                      src,
                      anchor: 0.5,
                  }),
              ]
            : [])
    )
}

function getTexts(
    card: Card,
    cardFrameTexture: PixiTexture,
    colorStops: ColorStop[]
): DisplayObject[] {
    const { marginH, marginV } = getMargins(cardFrameTexture)

    const cardFrameScale = cardFrameTexture.width / 791
    const explanationFontSize = getExplanationFontSize(
        cardFrameScale,
        card.explanation
    )

    return [
        Adjust(
            CurvedText({
                text: Text({
                    text: card.name,
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
                radius: cardFrameTexture.height * 0.5,
            }),
            {
                y: cardFrameTexture.width * 0.15,
            }
        ),
        Text({
            text: `<div style="font-family: sans-serif; padding: 4px">${upperFirst(
                card.explanation
            )}</div>`,
            isHtml: true,
            y: cardFrameTexture.height * 0.15,
            anchor: [0.5, 0],
            style: {
                wordWrap: true,
                wordWrapWidth: cardFrameTexture.width - marginH * 2,
                fontSize: explanationFontSize,
                align: 'center',
                fontFamily: 'monoFont',
                fill: 'black',
                lineHeight: explanationFontSize * 1.1,
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

function getExplanationFontSize(cardFrameScale: number, explanation: string) {
    const minExplanationFontSize = Math.round(35 * cardFrameScale)
    const maxExplanationFontSize = Math.round(50 * cardFrameScale)
    const unclampedExplanationFontSize =
        maxExplanationFontSize + 10 - getPlainTextLength(explanation) * 2
    const explanationFontSize =
        unclampedExplanationFontSize < minExplanationFontSize
            ? minExplanationFontSize
            : unclampedExplanationFontSize > maxExplanationFontSize
            ? maxExplanationFontSize
            : unclampedExplanationFontSize
    return explanationFontSize
}

function getPlainTextLength(text: string) {
    return text.replace(/(<([^>]+)>)/gi, '').length
}

function getMargins(cardFrameTexture: PixiTexture) {
    const marginH = cardFrameTexture.width * 0.15
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
            if (
                !(
                    ['self', 'allEnemies', 'allFriends'] as TargetType[]
                ).includes(card.targetType)
            )
                clearLastTargetSelection = beginTargetSelection(
                    cardEl.parent,
                    card
                )
            else callApi('playCard', { cardUid: card.uid, targetUids: [] })
        } else {
            flashTo(
                getStage(),
                () =>
                    Explanation({
                        texts: ['not enough energy!'],
                        displayObjectArgs: {
                            x: BASE_WIDTH / 2,
                            y: BASE_HEIGHT * 0.6,
                            borderThickness: 2,
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
        if (
            (['self', 'allEnemies'] as TargetType[]).includes(card.targetType)
        ) {
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

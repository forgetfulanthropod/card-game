import type { ColorStop } from '@pixi-essentials/gradients'
import { Tweener } from 'pixi-tweener'
import type { InteractionEvent } from 'pixi.js'
import { Texture } from 'pixi.js'
import type { Card, CardType, CardUid, CharacterUid } from 'shared'
import type { Datum } from 'datums'
import { upperFirst } from 'lodash'
import { beginTargetSelection } from './beginTargetSelection'
import { getCardTypeSrc } from './getCardTypeSrc'
import { hoveredCharacterUid } from '@/util'
import {
    Container,
    getRenderer,
    PixiContainer,
    RoundedRectangleGradientSprite,
    Sprite,
    Text,
    TweenableContainer,
} from '@/elementsUtil'
import type {
    InteractionEventHandler,
    InteractionEvents,
    PixiText,
    PixiTexture,
    TweenablePixiContainer,
    PixiSprite,
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
}: {
    rotation?: number
    width: number
    card: Card
    hoveredCardUid?: Datum<CharacterUid | null>
    events?: InteractionEvents
}): TweenablePixiContainer {
    const cardFrameTexture = getCardTypeSrc(card.type)
    const colorStops = getColorStopsFromCardType(card.type)
    const scale = width / cardFrameTexture.width

    return TweenableContainer(
        {
            name: card.uid,
            // cache: true, // doesn't update...
        },
        TweenableContainer(
            {
                events:
                    events ??
                    (hoveredCardUid ? getEvents(card, hoveredCardUid) : {}),
                rotation,
                scale,
                y: (cardFrameTexture.height / 2) * scale,
            },
            getGradientBackground(cardFrameTexture, colorStops),
            getCardFrameSprite(cardFrameTexture),
            getEnergyContainer(card, cardFrameTexture),
            ...getTexts(card, cardFrameTexture, colorStops),
            PointerAreaExtender(cardFrameTexture.width, cardFrameTexture.height)
        )
    )
}

export function CardSprite({
    rotation,
    width,
    card,
    hoveredCardUid,
    events,
}: {
    rotation?: number
    width: number
    card: Card
    hoveredCardUid?: Datum<CharacterUid | null>
    events?: InteractionEvents
}): PixiSprite {
    const el = CardEl({
        rotation,
        width,
        card,
        hoveredCardUid,
        events,
    })
    const src = getRenderer().generateTexture(el)
    // el.destroy(true)
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

function getGradientBackground(
    cardFrameTexture: PixiTexture,
    colorStops: ColorStop[]
) {
    return RoundedRectangleGradientSprite({
        radius: cardFrameTexture.width / 15,
        gradientArgs: {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: cardFrameTexture.height,
            colorStops,
        },
        spriteArgs: {
            width: cardFrameTexture.width,
            height: cardFrameTexture.height,
            anchor: 0.5,
        },
    })
}

function getCardFrameSprite(cardFrameTexture: PixiTexture) {
    return Sprite({
        src: cardFrameTexture,
        anchor: 0.5,
    })
}

function getEnergyContainer(
    card: Card,
    cardFrameTexture: PixiTexture
): PixiContainer {
    const wh = cardFrameTexture.width * 0.15
    return Container(
        {
            x: cardFrameTexture.width * 0.4,
            y: -cardFrameTexture.height * 0.42,
        },
        Sprite({
            src: 'cardEnergy',
            width: wh,
            height: wh,
            anchor: 0.5,
        }),
        Text({
            text: `${card.energy}`,
            style: {
                fill: '#eee',
                stroke: 'black',
                strokeThickness: 8,
                fontSize: wh * 0.9,
                fontFamily: 'bigFont',
            },
            anchor: [0.5, 0.5],
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
                strokeThickness: 6,
                lineHeight: 0,
            },
        }),
        Text({
            text: card.explanation,
            x: -cardFrameTexture.width / 2 + marginH,
            y: cardFrameTexture.width * 0.2,
            style: {
                wordWrap: true,
                wordWrapWidth: cardFrameTexture.width - marginH * 2,
                fontSize: 36 * cardFrameScale,
                fontFamily: 'monoFont',
                fill: 'black',
                lineHeight: 36 * cardFrameScale,
            },
        }),
        Text({
            text: card.characterClass,
            y: cardFrameTexture.height * 0.45,
            anchor: 0.5,
            style: {
                fontSize: 90 * cardFrameScale,
                fontFamily: 'bigFont',
                fill: colorStops[0].color,
                stroke: 'black',
                strokeThickness: 8,
                letterSpacing: 6,
            },
        }),
    ]
}

function getMargins(cardFrameTexture: PixiTexture) {
    const marginH = cardFrameTexture.width / 11
    const marginV = marginH
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
    const pointerover: InteractionEventHandler = _ => {
        hoveredCharacterUid.set(card.characterUid)
        hoveredCardUid.set(card.uid)
    }
    const pointerout: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        setTimeout(() => {
            if (hoveredCardUid.val === cardEl.parent.name) {
                hoveredCardUid.set(null)
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
        }
    }
    const pointerup: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        if (card.targetType === 'self') {
            console.log('Card.ts: playing card')

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

import type { AssetKey, CardTypeAssetId } from '@/assets'
import { callApi } from '@/callApi'
import { getBattleScene, getEntryScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    CurvedText,
    fontMap,
    flashTo,
    getRenderer,
    getStage,
    getTexture,
    InteractionEventHandler,
    InteractionEvents,
    PixiContainer,
    PixiSprite,
    PixiTexture,
    Sprite,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
    onDestroyed,
} from '@/elementsUtil'
import { toDiscardUids } from '@/scenes/run/BattleScene'
import {
    hoveredCharacterUid,
    hoveredSelectedCardUid,
    isAttacking,
    nextFrame,
    nextTick,
} from '@/util'
import type { ColorStop } from '@pixi-essentials/gradients'
import type { Datum } from 'datums'
import { datum } from 'datums'
import { upperFirst } from 'lodash'
import { Tweener } from 'pixi-tweener'
import { DisplayObject, FederatedPointerEvent, Rectangle } from 'pixi.js'
import { Texture } from 'pixi.js'
import type {
    Card,
    CardType,
    CardUid,
    CharacterUid,
    OwnedCharacterStats,
    TargetType,
} from 'shared'
import { keys } from 'shared/code'
import {
    Explanation,
    getTermIndex,
    keyTermsMap,
    TermExplanationsIf,
} from '../Explanation'
import { beginTargetSelection } from './beginTargetSelection'
import { CARD_WIDTH } from './CardAdder'
import { getCardTypeTexture } from './getCardTypeSrc'

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
    showTermExplanations,
    explanationsOnLeft,
    explanationsAdjustX,
    explanationsAdjustY,
    dynamicHitbox,
}: {
    rotation?: number
    width: number
    card: Card
    hoveredCardUid?: Datum<CharacterUid | null>
    events?: InteractionEvents
    omitPointerAreaExtender?: boolean
    showTermExplanations?: boolean
    explanationsOnLeft?: boolean
    explanationsAdjustX?: number
    explanationsAdjustY?: number
    dynamicHitbox?: boolean
}): TweenablePixiContainer {
    const cardFrameTexture = getCardTypeTexture(card.type)

    if (card.type == null || cardFrameTexture.baseTexture == null)
        return TweenableContainer({}, TweenableContainer({}))

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

    const isLongHovered = datum(showTermExplanations ?? false)
    const decoratedEvents: InteractionEvents = getDecoratedEvents({
        events,
        hoveredCardUid,
        isLongHovered,
        card,
    })

    const termExplanationsForCard = TermExplanationsForCard(
        card.explanation,
        width,
        isLongHovered
    )

    const unsubs: Callback[] = []

    const root = TweenableContainer(
        {
            name: card.uid,
            onDestroy: [
                ...(!hoveredCardUid
                    ? []
                    : [
                          hoveredCardUid.onChange(uid => {
                              if (uid !== card.uid) isLongHovered.set(false)
                          }),
                      ]),
                () => termExplanationsForCard.destroy(true),
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
        Adjust(termExplanationsForCard, {
            x:
                (explanationsOnLeft
                    ? -termExplanationsForCard.width - width
                    : 0) + (explanationsAdjustX ?? 0),
            y: explanationsAdjustY ?? 0,
        })
    )

    if (hoveredCardUid && dynamicHitbox) {
        const originalBounds = getOriginalHitboxBounds(root)
        root.hitArea = originalBounds

        const handleHoveredCardChange = (
            newCardUid: CardUid | null,
            oldCardUid: CardUid | null
        ) => {
            if (newCardUid && newCardUid === card.uid) {
                const newBounds = new Rectangle(
                    originalBounds.x - 45,
                    originalBounds.y - 60,
                    originalBounds.width + 89,
                    originalBounds.height + 200
                )
                root.hitArea = newBounds
            }

            if (oldCardUid && oldCardUid === card.uid) {
                root.hitArea = originalBounds
            }
        }

        const hoveredCardUidSub = hoveredCardUid.onChange(handleHoveredCardChange)
        unsubs.push(hoveredCardUidSub)
    }

    onDestroyed(root, ...unsubs)
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
        pointerenter(e) {
            dynamicEvents?.pointerenter?.(e)

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
        pointerleave(e) {
            dynamicEvents?.pointerleave?.(e)

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
): PixiContainer {
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
    omitPointerAreaExtender = true,
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

    nextTick().then(() => el.destroy())
    // nextTick().then(() => el.destroy(true)) //somehow this deletes the basetextures within the card textures???
    return Sprite({ src: getRenderer().generateTexture(el) })
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
            src:
                card.energy > -1
                    ? (`cardEnergy${card.energy}` as AssetKey)
                    : Texture.EMPTY,
            anchor: 0.5,
        })
    )
}

function getCardOwnerToken(card: Card): PixiContainer {
    let cm: OwnedCharacterStats
    try {
        cm = getBattleScene().get('allCharacters', card.characterUid)
    } catch {
        cm = getEntryScene()
            .get('selectedCharacters')
            .find(c => c?.uid === card.characterUid)!
    }

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

    const cardFrameScale = cardFrameTexture.width / 791 // legacy sizing adjustment
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
                        fontFamily: fontMap['bigFont'],
                        fill: 'white',
                        stroke: 'black',
                        strokeThickness: 6 * cardFrameScale,
                        lineHeight: 0,
                    },
                }),
                radius: cardFrameTexture.height * 0.5,
                maxWidth: CARD_WIDTH * 0.9,
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
                fontFamily: fontMap['monoFont'],
                fill: 'black',
                lineHeight: explanationFontSize * 1.1,
            },
        }),
        // quick fix for Bean to B.E.A.N. on cards
        Text({
            text:
                card.characterClass === 'notoriousBean'
                    ? 'Notorious B.E.A.N.'
                    : upperFirst(card.characterClass),
            y: cardFrameTexture.height * 0.4,
            anchor: 0.5,
            style: {
                fontSize: 40 * cardFrameScale,
                fontFamily: fontMap['sansFont'],
                fill: colorStops[0].color,
                stroke: 'black',
                strokeThickness: 3,
                letterSpacing: 3 * cardFrameScale,
            },
        }),
    ]
}

function getExplanationFontSize(cardFrameScale: number, explanation: string) {
    const minExplanationFontSize = Math.round(32 * cardFrameScale)
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
    const pointerenter: InteractionEventHandler = () => {
        if (hoveredSelectedCardUid.val === card.uid) return
        hoveredCharacterUid.set(card.characterUid)
        hoveredCardUid.set(card.uid)
    }
    const pointerleave: InteractionEventHandler = () => {
        setTimeout(() => {
            if (
                hoveredSelectedCardUid.val === card.uid &&
                isAttacking.val === false
            ) {
                hoveredSelectedCardUid.set(null)
            }
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
        pointerenter({
            currentTarget: cardEl,
        } as FederatedPointerEvent)

        if (!(cardEl instanceof PixiContainer))
            throw new Error('ERROR! should be bound to container')

        clearLastTargetSelection()

        const numRequiredToDiscard = getBattleScene().get().numRequiredToDiscard
        if (numRequiredToDiscard > 0) {
            const indexInExisting = toDiscardUids.val.indexOf(card.uid)
            if (indexInExisting === -1)
                toDiscardUids.set(
                    [...toDiscardUids.val, card.uid].slice(
                        -numRequiredToDiscard
                    )
                )
            else
                toDiscardUids.set([
                    ...toDiscardUids.val.slice(0, indexInExisting),
                    ...toDiscardUids.val.slice(indexInExisting + 1),
                ])

            return
        }

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
                            borderColor: 0x642193,
                        },
                        color: 0xaf5bec,
                    }),
                { durationMs: 1200 }
            )
        }
    }
    const pointerup: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        if (
            (['self', 'allEnemies', 'allFriends'] as TargetType[]).includes(
                card.targetType
            )
        ) {
            // console.log('Card.ts: playing card')

            void callApi('playCard', {
                cardUid: card.uid,
                targetUids: [],
            })
        }
        //for mobile
        else
            pointerleave({
                currentTarget: cardEl,
            } as FederatedPointerEvent)
    }

    // todo: detect pointermove for mobile to begin target selection..
    // const pointermove: InteractionEventHandler = function (e) {
    //     console.log({ e })
    //     // if (hasMovedEnough) pointerdown
    // }

    return {
        pointerenter,
        pointerleave,
        pointerdown,
        pointerup,
        // pointermove,
    }
}

export function getNullAnimation() {
    return Tweener.add({ target: {}, duration: 0 }, {})
}

const getOriginalHitboxBounds = (root: TweenablePixiContainer) => {
    const rootBounds = root.getBounds()
    return new Rectangle(
        rootBounds.x + 15,
        rootBounds.y + 20,
        rootBounds.width - 30,
        rootBounds.height - 20
    )
}

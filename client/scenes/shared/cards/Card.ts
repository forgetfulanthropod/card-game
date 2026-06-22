import type { AssetKey, CardTypeAssetId } from '@/assets'
import { callApi } from '@/callApi'
import { getBattleScene, getEntryScene, getScene, getTree } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    CurvedText,
    flashTo,
    fontMap,
    getRenderer,
    getStage,
    getTexture,
    If,
    InteractionEventHandler,
    InteractionEvents,
    onDestroyed,
    PixiContainer,
    PixiSprite,
    PixiTexture,
    Sprite,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { toDiscardUids } from '@/scenes/run/BattleScene'
import {
    currAnimatingCardUid,
    currTargetingType,
    nextTick,
    selectedForTargetingCardUid,
} from '@/util'
import type { ColorStop } from '@pixi-essentials/gradients'
import { compose, Datum, datum } from 'datums'
import { upperFirst } from 'lodash'
import { Tweener } from 'pixi-tweener'
import {
    DisplayObject,
    FederatedPointerEvent,
    Rectangle,
    Texture,
} from 'pixi.js'
import {
    Card,
    CardType,
    CardUid,
    CharacterMeta,
    CharacterStats,
    CharacterUid,
    StanceId,
} from 'shared'
import { keys } from 'shared/code'
import {
    Explanation,
    getTermIndex,
    keyTermsMap,
    TermExplanations,
} from '../Explanation'
import { HoverableStances } from './HoverableStances'
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
    omitStances,
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
    omitStances?: boolean
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

    const termExplanationsForCard = TermExplanationsForCard({
        card,
        width,
    })
    const hoveredStanceDatum = datum<StanceId | null>(null)

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
                () => termExplanationsForCard.forEach(e => e?.destroy(true)),
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

            ...(omitPointerAreaExtender
                ? []
                : [
                      PointerAreaExtender(
                          cardFrameTexture.width,
                          cardFrameTexture.height
                      ),
                  ]),
            If(
                compose(
                    ([selectedForTargetingCardUid, hoveredCardUid]) => {
                        if (getScene().get('id') !== 'battle') return false

                        return (
                            !omitStances &&
                            (hoveredCardUid === card.uid ||
                                selectedForTargetingCardUid === card.uid)
                        )
                    },
                    selectedForTargetingCardUid,
                    ...(hoveredCardUid ? [hoveredCardUid] : [])
                ),
                () =>
                    Adjust(HoverableStances(card, hoveredStanceDatum), {
                        y: -width,
                    }),
                undefined,
                {
                    displayArgs: { events: {} },
                }
            ),

            // getGradientBackground(cardFrameTexture, colorStops),
            NonInteractiveElements(cardArtTexture, cardFrameTexture, card),

            ...getTexts(card, cardFrameTexture, colorStops, hoveredStanceDatum)
        ),
        If(
            isLongHovered,
            () =>
                Container(
                    {
                        x:
                            (explanationsOnLeft
                                ? -Math.max(
                                      0,
                                      ...termExplanationsForCard.map(
                                          e => e.width
                                      )
                                  ) - width
                                : 20) + (explanationsAdjustX ?? 0),
                        y: explanationsAdjustY ?? 0,
                    },
                    ...termExplanationsForCard
                ),
            () => Container({}),
            { destroyOptions: { children: false } }
        )
    )

    if (selectedForTargetingCardUid.val === card.uid)
        clearLastTargetSelection = beginTargetSelection(root, card)

    if (hoveredCardUid && dynamicHitbox) {
        changeHitboxOnHover(root, card, hoveredCardUid, unsubs)
    } else if (hoveredCardUid) {
        root.children[0].on('pointerenter', () => hoveredCardUid.set(card.uid))
        root.children[0].on('pointerleave', () => hoveredCardUid.set(null))
    }

    onDestroyed(root, ...unsubs)
    return root
}

function NonInteractiveElements(
    cardArtTexture: PixiTexture,
    cardFrameTexture: PixiTexture,
    card: Card
) {
    const root = Container(
        {},
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
        getCardOwnerToken(card)
    )

    root.interactiveChildren = false

    return root
}

function changeHitboxOnHover(
    root: TweenablePixiContainer,
    card: Card,
    hoveredCardUid: Datum<CharacterUid | null>,
    unsubs: Callback[]
) {
    const unhoveredHitArea = getAdjustedHitAreaBounds(root)
    root.hitArea = unhoveredHitArea

    async function handleHoveredCardChange(
        newCardUid: CardUid | null,
        oldCardUid: CardUid | null
    ) {
        if (newCardUid && newCardUid === card.uid) {
            const hoveredHitArea = new Rectangle(
                unhoveredHitArea.x - 45,
                unhoveredHitArea.y - 90,
                unhoveredHitArea.width + 88,
                unhoveredHitArea.height + 150
            )
            root.hitArea = hoveredHitArea
        }
        if (oldCardUid && oldCardUid === card.uid) {
            root.hitArea = unhoveredHitArea
        }
    }
    unsubs.push(hoveredCardUid.onChange(handleHoveredCardChange))
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
            if (selectedForTargetingCardUid.val) return
            dynamicEvents?.pointerenter?.(e)

            isHovering.set(true)
            setTimeout(() => {
                if (
                    isHovering.val &&
                    selectedForTargetingCardUid.val !== card.uid
                )
                    isLongHovered.set(true)
            }, 400)
        },
        pointerdown(e) {
            dynamicEvents?.pointerdown?.(e)

            isHovering.set(true)
        },
        pointerleave(e) {
            if (selectedForTargetingCardUid.val) return
            dynamicEvents?.pointerleave?.(e)

            isHovering.set(false)
            isLongHovered.set(false)
        },
    }
    return decoratedEvents
}

function TermExplanationsForCard({
    card,
    width,
}: {
    card: Card
    width: number
}) {
    const explanation = card.explanation
    const tree = getTree()
    const characterMeta =
        tree.select('scene').get('id') === 'battle'
            ? getBattleScene().get('allCharacters', card.characterUid)
            : (getEntryScene()
                  .get('selectedCharacters')
                  .find(c => c?.uid === card.characterUid)! as CharacterMeta)
    const allKeyTerms = keys(keyTermsMap)
    const terms = allKeyTerms
        .filter(keyTerm => ~getTermIndex(keyTerm, explanation))
        .sort(
            (keyTermA, keyTermB) =>
                getTermIndex(keyTermA, explanation) -
                getTermIndex(keyTermB, explanation)
        )

    return TermExplanations({
        terms,
        characterMeta,
        displayObjectArgs: {
            x: width * 0.5,
        },
    })
    //     {
    //     areShown: isLongHovered,
    //     terms,
    //     xOffset: width * 0.5,
    //     noPortalize: true,
    // })
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
            height: height * 1.05,
            alpha: 0,
            //DEBUG
            // alpha: 0.2,
            anchor: [0.5, 1],
            y: height * 0.5,
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
    let cm: CharacterStats
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
    colorStops: ColorStop[],
    hoveredStanceDatum: Datum<StanceId | null>
): DisplayObject[] {
    const { marginH, marginV } = getMargins(cardFrameTexture)

    const cardFrameScale = cardFrameTexture.width / 791 // legacy sizing adjustment
    const explanationFontSize = getExplanationFontSize(
        cardFrameScale,
        card.explanation
    )

    const explanationText = Container(
        {
            name: 'ExplanationText',
            onDestroy: [
                hoveredStanceDatum.onChange(id => {
                    explanationText.addChild(
                        ExplanationText(
                            card.explanation,
                            cardFrameTexture,
                            marginH,
                            explanationFontSize
                        )
                    )
                    explanationText.removeChildAt(0)
                }),
            ],
        },
        ExplanationText(
            card.explanation,
            cardFrameTexture,
            marginH,
            explanationFontSize
        )
    )

    const maxWidth = CARD_WIDTH * 0.9
    let text = Text({
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
    })
    if (text.width > maxWidth) {
        const oldText = text
        text = Text({
            text: card.name,
            anchor: [0.5, 0.2],
            style: {
                fontSize: (54 * cardFrameScale * maxWidth) / text.width,
                fontFamily: fontMap['bigFont'],
                fill: 'white',
                stroke: 'black',
                strokeThickness: 6 * cardFrameScale,
                lineHeight: 0,
            },
        })
        oldText.destroy()
    }

    return [
        Adjust(
            CurvedText({
                text,
                radius: cardFrameTexture.height * 0.5,
                maxWidth,
            }),
            {
                y: cardFrameTexture.width * 0.15,
            }
        ),
        explanationText,
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

function ExplanationText(
    explanation: string,
    cardFrameTexture: PixiTexture,
    marginH: number,
    explanationFontSize: number
): DisplayObject {
    return Text({
        text: `<div style="font-family: sans-serif; padding: 4px">${upperFirst(
            explanation
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
    })
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
        cardTypeToColorMap[`cardType${upperFirst(cardType)}` as keyof typeof cardTypeToColorMap] as number[]

    return bgGradientColors.map(
        (color, i): ColorStop => ({
            color,
            offset: i / bgGradientColors.length,
        })
    )
}

let clearLastTargetSelection = () => {}
export function getEvents(
    card: Card,
    hoveredCardUid: Datum<CardUid | null>
): InteractionEvents {
    const pointerenter: InteractionEventHandler = () => {
        // hoveredCharacterUid.set(card.characterUid)
        hoveredCardUid.set(card.uid)
    }
    const pointerleave: InteractionEventHandler = () => {
        if (hoveredCardUid.val === card.uid) {
            hoveredCardUid.set(null)
            // hoveredCharacterUid.set(null)
        }
    }
    const pointerdown: InteractionEventHandler = e => {
        const clickType = e.button === 2 ? 'rightClick' : 'leftClick'
        if (selectedForTargetingCardUid.val === card.uid) {
            if (currTargetingType.val === 'drag' && clickType === 'leftClick') {
                currAnimatingCardUid.set(card.uid)
                void callApi('playCard', {
                    cardUid: card.uid,
                    targetUids: [],
                })
                clearLastTargetSelection()
            }
            return
        }
        //for mobile
        const cardEl = e.currentTarget
        if (cardEl instanceof PixiContainer) {
            // @ts-expect-error
            pointerenter({
                currentTarget: cardEl,
            } as FederatedPointerEvent)
            clearLastTargetSelection()
        }

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
            if (cardEl instanceof PixiContainer)
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
    const pointerup: InteractionEventHandler = ({ currentTarget: cardEl }) => {
        //for mobile
        if (cardEl instanceof PixiContainer) {
            // @ts-expect-error
            pointerleave({
                currentTarget: cardEl,
            } as FederatedPointerEvent)
        }
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

const getAdjustedHitAreaBounds = (root: TweenablePixiContainer) => {
    const rootBounds = root.getBounds()
    return new Rectangle(
        rootBounds.x + 15,
        rootBounds.y + 20,
        rootBounds.width - 30,
        rootBounds.height - 20
    )
}

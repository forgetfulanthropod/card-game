import { vals } from 'shared/code'
import type { Datum } from 'datums'
import { datum } from 'datums'
import type { CardUid } from 'shared'
import { NUM_DRAFT_CARD_OPTIONS } from 'shared'
import { ConfirmButton, ModalBackdrop } from '@sharedElements'
import { AdjustmentFilter } from 'pixi-filters'
import { CardEl } from './Card'
import { animateTo } from './Hand'
import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    glowFilter,
    If,
    RoundedRectangleGradientSprite,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiContainer, TweenablePixiContainer } from '@/elementsUtil'
import { toDatum } from '@/util'
import { callApi } from '@/callApi'

export const CARD_WIDTH = 240

export function CardAdder(): PixiContainer {
    // const w = 400
    const stateC = getBattleScene().select('state')
    const notInBattle = toDatum(
        stateC,
        winState => winState === 'choosing cards'
    )
    return If(notInBattle, () => NewCardOptions(), undefined, {
        displayArgs: {
            onDestroy: [notInBattle.destroy],
            name: CardAdder.name,
        },
    })
}

function NewCardOptions(): PixiContainer {
    const selectedCardUid = datum<CardUid | null>(null)
    const CardOptions = Options(selectedCardUid)
    CardOptions.forEach(card => {
        const { x, y, rotation } = card

        setTimeout(() => {
            animateTo(card, {
                scale: 1,
                rotation,
                x,
                y: y - BASE_HEIGHT / 2 + 150,
            })
        }, 10)
    })

    return Container(
        { name: 'CardOptions' },
        ModalBackdrop(),
        ScreenHeading(),
        ...CardOptions,
        If(selectedCardUid, cardUid =>
            ConfirmButton(() => {
                void callApi('addCardToDeck', { cardUid })
                selectedCardUid.set(null)
            })
        )
    )
}

function ScreenHeading() {
    const DraftCardBanner = Sprite({
        src: getTexture('draftCardBanner'),
        anchor: [0.5, 0],
        x: BASE_WIDTH / 2,
        y: -350,
        scale: 0.5,
    })

    return Container({}, DraftCardBanner)
}

function Options(
    selectedCardUid: Datum<CardUid | null>
): TweenablePixiContainer[] {
    const cardPile = getBattleScene().get('newCardOptions')
    const lessImportantFilter = new AdjustmentFilter({ saturation: 0.5 })

    const cardEls = vals(cardPile).map((card, i) => {
        const pointerenter = () => {
            if (selectedCardUid.val == null)
                cardEls.forEach(el => (el.filters = null))

            cardEl.filters = [...(cardEl.filters ?? []), glowFilter]
        }
        const cardEl = Adjust(
            CardEl({
                card,
                width: CARD_WIDTH,
                hoveredCardUid: selectedCardUid,
                events: {
                    pointerup() {
                        cardEls.forEach(el => {
                            el.scale.set(1)
                            el.filters = [lessImportantFilter]
                        })
                        cardEl.filters = [glowFilter]
                        cardEl.scale.set(1.1)

                        selectedCardUid.set(card.uid)
                    },
                    pointerdown: pointerenter,
                    pointerenter,
                    pointerleave() {
                        if (cardEl.filters == null) return

                        cardEl.filters = null
                    },
                },
                omitPointerAreaExtender: true,
            }),
            {
                y: BASE_HEIGHT - CARD_WIDTH,
                x:
                    BASE_WIDTH / 2 +
                    (-(NUM_DRAFT_CARD_OPTIONS - 1) / 2 + i) * CARD_WIDTH * 1.8,
            }
        )

        return cardEl
    })

    return cardEls.reverse()
}

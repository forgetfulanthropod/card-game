import { Texture } from 'pixi.js'
import { vals } from 'shared/code'
import type { Datum } from 'datums'
import { datum } from 'datums'
import type { CardUid } from 'shared'
import { KawaseBlurFilter } from 'pixi-filters'
import { Card } from './Card'
import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    glowFilter,
    If,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiContainer, PixiSprite } from '@/elementsUtil'
import { toDatum } from '@/util'
import { callApi } from '@/actions'

export function CardAdder(): PixiContainer {
    // const w = 400
    const stateC = getBattleScene().select('state')
    const notInBattle = toDatum(
        stateC,
        winState => winState === 'choosing cards'
    )
    return If(notInBattle, () => NewCardOptions(), undefined, {
        onDestroy: [notInBattle.destroy],
        name: CardAdder.name,
    })
}

function NewCardOptions(): PixiContainer {
    const selectedCardUid = datum<CardUid | null>(null)

    return Container({
        name: 'CardOptions',
        children: [
            Backdrop(),
            ...Options(selectedCardUid),
            ConfirmButton(selectedCardUid),
        ],
    })
}

const NUM_CARD_OPTIONS = 5
function Options(selectedCardUid: Datum<CardUid | null>): PixiContainer[] {
    const cardPile = getBattleScene().get('newCardOptions')
    const blurFilter = new KawaseBlurFilter(4.6)

    const hoveredCardUid = datum(null)
    const cardWidth = 260
    const cardEls = vals(cardPile).map((card, i) => {
        const pointerover = () => {
            if (selectedCardUid.val == null) return
            cardEls.forEach(el => (el.filters = []))
            cardEl.filters = [glowFilter]
        }
        const cardEl = Adjust(
            Card({
                card,
                width: cardWidth,
                events: {
                    pointerup() {
                        cardEls.forEach(el => (el.filters = [blurFilter]))
                        cardEl.filters = [glowFilter]

                        selectedCardUid.set(card.uid)
                    },
                    pointerdown: pointerover,
                    pointerover,
                },
            }),
            {
                y: BASE_HEIGHT / 2 - cardWidth,
                x:
                    BASE_WIDTH / 2 +
                    (-(NUM_CARD_OPTIONS - 1) / 2 + i) * cardWidth * 1.2,
            }
        )

        return cardEl
    })

    return cardEls
}

function Backdrop(): PixiSprite {
    return Sprite({
        src: Texture.WHITE,
        tint: 0,
        alpha: 0.5,
        width: BASE_WIDTH * 2,
        height: BASE_HEIGHT * 2,
        events: {},
    })
}

function ConfirmButton(selectedCardUid: Datum<CardUid | null>): PixiContainer {
    const texture = getTexture('endTurnButton')

    return If(selectedCardUid, cardUid =>
        Container({
            x: BASE_WIDTH * 0.9,
            y: BASE_HEIGHT * 0.78,
            onClick: () => {
                void callApi('AddCardToDeck', { cardUid })
                selectedCardUid.set(null)
            },
            children: [
                Sprite({
                    src: texture,
                    anchor: [0.5, 0.5],
                    width: BASE_WIDTH * 0.15,
                    height:
                        (BASE_WIDTH * 0.15 * texture.height) / texture.width,
                }),
                Text({
                    text: 'Confirm',
                    anchor: [0.5, 0.5],
                    style: {
                        fill: 0xffffff,
                        fontSize: 44,
                        fontFamily: 'bigFont',
                    },
                }),
            ],
        })
    )
}

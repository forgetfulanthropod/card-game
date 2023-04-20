import { getBattleScene } from '@/data'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    glowFilter,
    If,
    Sprite,
} from '@/elementsUtil'
import { ScrollBox } from '@pixi/ui'
import { compose, datum, Datum } from 'datums'
import { keys, without } from 'lodash'
import { Texture } from 'pixi.js'
import { CardUid, PileId } from 'shared'
import { vals } from 'shared/code'
import { CARD_WIDTH_FULL, ConfirmButton } from '../shared'
import { CardEl } from '../shared/cards/Card'
import { Backdrop } from './Backdrop'

export function DeckViewer(
    pileId: PileId,
    chosenCardUids?: Datum<CardUid[]>,
    upToN?: number
) {
    const scene = getBattleScene()
    const _chosenCardUids = datum<CardUid[]>([])

    const cardsPerRow = 4
    const hoveredCardUid = datum(null)
    const cards = Container(
        {
            onDestroy: [
                hoveredCardUid.onChange((uid, prevUid) => {
                    if (uid) {
                        cards.getChildByName(uid)!.zIndex = 99
                        cards.sortChildren()
                    }
                    if (prevUid) {
                        cards.getChildByName(prevUid)!.zIndex = 1
                    }
                }),
            ],
        },
        ...vals(scene.get('cards', pileId)).map((card, index) =>
            Container(
                {
                    x: (index % cardsPerRow) * CARD_WIDTH_FULL * 1.1,
                    y: ((index / cardsPerRow) | 0) * CARD_WIDTH_FULL * 1.4,
                    name: card.uid,
                },
                CardEl({
                    width: CARD_WIDTH_FULL,
                    card,
                    explanationsAdjustX: 0,
                    explanationsAdjustY: 200,
                    explanationsOnLeft: index % 4 === 3,
                    events: chosenCardUids
                        ? {
                              pointerup() {
                                  if (_chosenCardUids.val.includes(card.uid))
                                      _chosenCardUids.set(
                                          without(_chosenCardUids.val, card.uid)
                                      )
                                  else {
                                      let uids = [
                                          card.uid,
                                          ..._chosenCardUids.val,
                                      ]
                                      if (upToN) uids = uids.slice(0, upToN)
                                      _chosenCardUids.set(uids)
                                  }
                              },
                          }
                        : {},
                    hoveredCardUid,
                })
            )
        ),
        // bottom padding
        Sprite({
            src: Texture.WHITE,
            alpha: 0,
            y:
                Math.ceil(
                    keys(scene.get('cards', 'draw')).length / cardsPerRow
                ) *
                    CARD_WIDTH_FULL *
                    1.4 +
                CARD_WIDTH_FULL * 0.7,
        })
    )
    cards.sortableChildren = true
    _chosenCardUids.onChange(uids =>
        cards.children.forEach(
            cardEl =>
                (cardEl.filters = uids.includes(cardEl.name!)
                    ? [glowFilter]
                    : null)
        )
    )
    const scrollbox = new ScrollBox({
        items: [cards],
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        background: 'none',
        disableDynamicRendering: true,
        type: 'vertical',
    })
    // const scrollbox = new Scrollbox({
    //     boxWidth: BASE_WIDTH,
    //     boxHeight: BASE_HEIGHT,
    //     dragScroll: true,
    //     overflow: 'hidden',
    // })
    // scrollbox.content.addChild(cards)
    // scrollbox.update()

    cards.x = (BASE_WIDTH - cards.width) / 2 + CARD_WIDTH_FULL / 2
    cards.y = BASE_HEIGHT * 0.1

    const root = Container(
        {},
        Backdrop({
            events: {
                pointerup: removeRoot,
            },
        }),
        scrollbox,
        If(
            compose(([chosen]) => !!chosen.length, _chosenCardUids),
            () =>
                ConfirmButton(() => {
                    removeRoot()
                    chosenCardUids?.set(_chosenCardUids.val)
                })
        )
    )

    return root

    function removeRoot() {
        root.parent.removeChild(root)
        root.destroy()
    }
}

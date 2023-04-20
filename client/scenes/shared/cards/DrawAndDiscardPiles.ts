import { getBattleScene } from '@/data'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    fontMap,
    getStage,
    onDestroyed,
    PixiContainer,
    Sprite,
    Text,
    TweenableContainer,
} from '@/elementsUtil'
import { DeckViewer } from '@/scenes/run/DeckViewer'
import { toDatum } from '@/util'
import { Tweener } from 'pixi-tweener'
import { vals } from 'shared/code'
import { animateBounceScale } from '..'
import { getTexture } from './getCardTypeSrc'

export function DrawPile(): PixiContainer {
    return Pile('draw')
}

export function DiscardPile(): PixiContainer {
    return Pile('discard')
}

function Pile(drawOrDiscard: 'draw' | 'discard'): PixiContainer {
    const src = getTexture(`${drawOrDiscard}Pile`)
    const pileDatum = toDatum(
        getBattleScene().select('cards').select(drawOrDiscard),
        pile => pile
    )

    pileDatum.onChange((newPile, oldPile) => {
        animateBounceScale(pileIcon)
        pileSize.text = `${vals(newPile).length}`
    })

    const x = (drawOrDiscard === 'draw' ? 1 : -1) * src.width
    const y = -65

    const pileSizeBg = TweenableContainer(
        {
            scale: 1,
            x,
            y,
        },
        Sprite({
            src: getTexture('cardBackPileSizeOverlay'),
            scale: 0.7,
            anchor: [0.5, 0.5],
        })
    )

    const pileSize = Text({
        text: `${vals(pileDatum.val).length}`,
        anchor: [0.5, 0.5],
        x,
        y,
        style: {
            fill: 0xffffff,
            fontSize: 48 * 0.7,
            fontFamily: fontMap['bigFont'],
        },
    })

    const pileIcon = TweenableContainer(
        {
            x: x / 2 + (drawOrDiscard === 'draw' ? 10 : -15),
            y: y - 10,
            scale: 0.8,
        },
        Sprite({
            src,
            anchor: [0.5, 0.5],
        })
    )

    const root = Container(
        {
            x: drawOrDiscard === 'draw' ? 0 : BASE_WIDTH,
            y: BASE_HEIGHT,
            events: {
                pointerup() {
                    getStage().addChild(DeckViewer(drawOrDiscard))
                },
            },
        },
        pileIcon,
        pileSizeBg,
        pileSize
    )

    onDestroyed(root, pileDatum.destroy, () => Tweener.killTweensOf(pileIcon))

    return root
}

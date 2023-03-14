import type { Pile } from 'shared'

import { vals } from 'shared/code'
import { getTexture } from './getCardTypeSrc'
import { onDestroyed, PixiContainer, TweenableContainer } from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { getBattleScene } from '@/data'
import { animateBounceScale, animateFastBounceScale } from '..'
import { Tweener } from 'pixi-tweener'

export function DiscardPile(): PixiContainer {
    const src = getTexture('discardPile')
    const discardPileDatum = toDatum(
        getBattleScene().select('cards').select('discard'),
        pile => pile
    )

    discardPileDatum.onChange((newPile, oldPile) => {
        const [newLength, oldLength] = [vals(newPile).length, vals(oldPile).length]
        if (newLength - oldLength > 1) {
            // all cards were discarded
            let tempLength = oldLength
            const animate = animateFastBounceScale(PileIcon)
            const discardInterval = setInterval(() => {
                animate()
                PileSize.text = `${tempLength}`
                if (tempLength === newLength) {
                    clearInterval(discardInterval)
                }
                tempLength++
            }, 100)
        } else {
            // one card was played
            setTimeout(() => {
                animateBounceScale(PileIcon)
                PileSize.text = `${vals(newPile).length}`
            }, 300) // play card animation length is around this length
        }
    })

    const x = -src.width
    const y = -65

    const PileSizeBg = TweenableContainer(
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

    const PileSize = Text({
        text: `${vals(discardPileDatum.val).length}`,
        anchor: [0.5, 0.5],
        x,
        y,
        style: {
            fill: 0xffffff,
            fontSize: 48 * 0.7,
            fontFamily: 'bigFont',
        },
    })

    const PileIcon = TweenableContainer(
        {
            x: x / 2 - 15,
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
            x: BASE_WIDTH,
            y: BASE_HEIGHT,
        },
        PileIcon,
        PileSizeBg,
        PileSize
    )

    onDestroyed(root, discardPileDatum.destroy, () =>
        Tweener.killTweensOf(PileIcon)
    )

    return root
}

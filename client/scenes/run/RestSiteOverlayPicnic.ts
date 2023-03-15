import { Texture } from 'pixi.js'
import { datum } from 'datums'
import { Explanation } from '@sharedElements'
import { glowFilter, loopSong, PixiContainer } from '@/elementsUtil'
import {
    If,
    BASE_WIDTH,
    BASE_HEIGHT,
    Sprite,
    Container,
    Spine,
} from '@/elementsUtil'
import type { AnimationId } from '@/assets'
import { callApi } from '@/callApi'
import { collectData } from '@/analytics/collectData'

export const plushyChoiceDescriptions = [
    // 'revive a character with 25% Health',
    // 'heal a character for 50% of its Health',
    // "bring back a character's exhausted abilities",
    'Heal all characters by 25%',
    'Heal all characters by 25%',
    'Heal all characters by 25%',
]

export function RestSiteOverlay(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Rest Site' })
    const animations: AnimationId[] = ['Position 3', 'Position 2', 'Position 1']

    loopSong('restSiteMusicHooligansBluff')

    const xya = {
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 0.5,
        anchor: 0.5,
    }

    const choices = [
        Sprite({
            src: 'restSitePenguin',
            ...xya,
        }),
        Sprite({
            src: 'restSiteFrog',
            ...xya,
        }),
        Sprite({
            src: 'restSiteWarhog',
            ...xya,
        }),
    ]

    const hoveredBoxIndex = datum<number | null>(null)
    const boundingBoxes = calcBoundingBoxes()
    const boxes = boundingBoxes.map(([x, y, w, h], i) => {
        const s = Sprite({
            src: Texture.WHITE,
            x: x * BASE_WIDTH,
            y: y * BASE_HEIGHT,
            width: w * BASE_WIDTH,
            height: h * BASE_HEIGHT,
            alpha: 0.0,
            events: {
                pointerenter() {
                    choices[i].filters = [glowFilter]
                    hoveredBoxIndex.set(i)
                },
                pointerup() {
                    void callApi('choosePlushy', {
                        index: i,
                    })
                },
                pointerleave() {
                    choices[i].filters = []
                    hoveredBoxIndex.set(null)
                },
            },
        })
        return s
    })

    const bg = Sprite({
        src: 'restSiteBg',
        events: {
            pointerenter() {},
        },
        ...xya,
    })
    bg.cursor = 'default'

    return Container(
        {},
        bg,
        ...choices,
        ...boxes,
        If(hoveredBoxIndex, index => {
            // console.log({
            //     x: boundingBoxes[index][0],
            //     y: boundingBoxes[index][1] + boundingBoxes[index][3],
            // })
            return Explanation({
                texts: [plushyChoiceDescriptions[index]],
                displayObjectArgs: {
                    x: boundingBoxes[index][0] * BASE_WIDTH + 0.05 * BASE_WIDTH,
                    y:
                        (boundingBoxes[index][1] + boundingBoxes[index][3]) *
                        BASE_HEIGHT,
                },
            })
        })
    )
}

function calcBoundingBoxes(): Rect[] {
    const lefts = [0.203, 0.396, 0.595]
    const tops = [0.26, 0.16, 0.2]
    const widths = [0.18, 0.2, 0.833 - 0.595]
    const heights = [0.37, 0.37, 0.39]
    return lefts.map((_, i) => [lefts[i], tops[i], widths[i], heights[i]])
}

import { Texture } from 'pixi.js'
import { datum } from 'datums'
import { ExplanationBox } from '@sharedElements'
import type { PixiContainer } from '@/elementsUtil'
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

export const plushyChoiceDescriptions = [
    'revive a character with 25% Health',
    'heal a character for 50% of its Health',
    "bring back a character's exhausted abilities",
]

export function RestSiteOverlay(): PixiContainer {
    const animations: AnimationId[] = ['Position 3', 'Position 2', 'Position 1']
    const boundingBoxes = calcBoundingBoxes()
    const spine = Spine({
        name: 'restSiteSceneSpine',
        // size: [BASE_WIDTH, BASE_HEIGHT],
        animation: animations[0],
        events: {
            // ...basicEvents,
            // pointerup: pointerout,
            // ...events, // choosing not to extend base events on override..
            // //@ts-expect-error
            // ...keys(events).reduce((processedEvents, eventKey) => {
            //     processedEvents[eventKey] = e => {
            //         events?.[eventKey]?.(e)
            //         basicEvents[eventKey]()
            //     }
            //     return processedEvents
            // }, {} as InteractionEvents),
        },
        // onSpineEvent,
        // onDestroy: [hoveredCharacterUid.onChange(updateGlow)],
    })
    spine.scale.set(1.01) // mysterious missing row of pixels on the bottom

    const hoveredBoxIndex = datum<number | null>(null)

    const boxes = boundingBoxes.map(([x, y, w, h], i) => {
        const s = Sprite({
            src: Texture.WHITE,
            x: x * BASE_WIDTH,
            y: y * BASE_HEIGHT,
            width: w * BASE_WIDTH,
            height: h * BASE_HEIGHT,
            alpha: 0.0,
            events: {
                pointerover() {
                    const anim = spine.state.setAnimation(
                        0,
                        animations[i],
                        false
                    )
                    anim.mixDuration = 0.2

                    hoveredBoxIndex.set(i)
                },
                pointerdown() {
                    // choosePlushyAction(){}
                    void callApi('choosePlushy', {
                        index: i,
                    })
                },
                pointerout() {
                    hoveredBoxIndex.set(null)
                },
            },
        })
        return s
    })
    return Container(
        {},
        spine,
        ...boxes,
        If(hoveredBoxIndex, index => {
            // console.log({
            //     x: boundingBoxes[index][0],
            //     y: boundingBoxes[index][1] + boundingBoxes[index][3],
            // })
            return ExplanationBox({
                texts: [plushyChoiceDescriptions[index]],
                displayObjectArgs: {
                    x:
                        (boundingBoxes[index][0] +
                            boundingBoxes[index][2] / 2) *
                        BASE_WIDTH,
                    y:
                        (boundingBoxes[index][1] + boundingBoxes[index][3]) *
                        BASE_HEIGHT,
                },
            })
        })
    )
}

function calcBoundingBoxes(): Rect[] {
    const lefts = [0.079, 0.374, 0.662]
    const top = 0.36
    const w = 0.271
    const h = 0.481
    return lefts.map(left => [left, top, w, h])
}

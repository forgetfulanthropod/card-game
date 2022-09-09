import { Texture } from 'pixi.js'
import type { PixiContainer } from '@/elementsUtil'
import {
    BASE_WIDTH,
    BASE_HEIGHT,
    Sprite,
    Container,
    Spine,
} from '@/elementsUtil'
import type { AnimationId } from '@/assets'

export function RestSiteOverlay(): PixiContainer {
    console.log('RestSiteOverlay')
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
                },
                pointerdown() {
                    // choosePlushyAction(){}
                },
                // pointerover() {
                //     s.alpha = 0.1
                // },
                pointerout() {
                    s.alpha = 0.0
                },
            },
        })
        return s
    })
    return Container({}, spine, ...boxes)
}

function calcBoundingBoxes(): Rect[] {
    const lefts = [0.079, 0.374, 0.662]
    for (const l of lefts) {
        console.log(l / 1500)
    }
    const top = 0.36
    const w = 0.271
    const h = 0.481
    return lefts.map(left => [left, top, w, h])
}

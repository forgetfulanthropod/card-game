import {
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getRenderer,
    getStage,
    PixiContainer,
    Sprite,
} from '@/elementsUtil'
import { nextFrame } from '@/util'
import { range, upperFirst } from 'lodash'
import { Card } from 'shared'

export function TargetingArrow(
    card: Card,
    cancelTargeting: () => void
): PixiContainer {
    const numBeads = 20
    const arrowEquivalentToNumBeads = 2
    const numBeadsOmittedFromEnd = 1
    const stage = getStage()

    const defaultCursor = getRenderer().events.cursorStyles.default
    const hoverCursor = getRenderer().events.cursorStyles.hover

    getRenderer().events.cursorStyles.default = 'none'
    getRenderer().events.cursorStyles.hover = 'none'

    const root = Container(
        {
            onDestroy: [
                () => {
                    stage.interactive = false

                    stage.off('pointermove', onPointerMove)
                    stage.off('pointerup', onPointerUp)

                    getRenderer().events.cursorStyles.default = defaultCursor
                    getRenderer().events.cursorStyles.hover = hoverCursor
                },
            ],
        },
        ...range(0, numBeads).map(i =>
            Sprite({
                src: `targetingBead${upperFirst(card.type)}` as AssetKey,
                name: `targetingBead-${i}`,
                anchor: 0.5,
                scale: 0.6 - ((numBeads - i) * 0.1) / numBeads,
                x: -10000,
            })
        ),
        Sprite({
            // src: `targetingArrow${upperFirst(card.type)}` as AssetKey,
            src: `targetingArrow${upperFirst(card.type)}` as AssetKey,
            name: `targetingArrow${upperFirst(card.type)}`,
            scale: 0.3,
            anchor: [0.5, -0.1],
            x: -10000,
        })
    )

    stage.interactive = true
    let cursorWentIntoPlayArea = false
    stage.on('pointermove', onPointerMove)
    stage.on('pointerup', onPointerUp)

    return root

    function onPointerUp() {
        nextFrame().then(() => cursorWentIntoPlayArea && cancelTargeting())
    }

    function onPointerMove(e: any) {
        const pos = e.data.global

        if (pos.y > BASE_HEIGHT * 0.83) {
            if (cursorWentIntoPlayArea) cancelTargeting()

            return
        } else {
            cursorWentIntoPlayArea = true
        }

        updateArrow(pos.x, pos.y)
    }

    function updateArrow(x1: number, y1: number) {
        const x0 = BASE_WIDTH / 2
        const y0 = BASE_HEIGHT * 0.65

        root.children.forEach((child, index) => {
            // const x = x0 + ((x - x0) / numBeads) * index
            // const y = y0 + ((y - y0) / numBeads) * index
            const [x, y] = bezier({
                x0,
                y0,
                x1,
                y1,
                t:
                    1 -
                    Math.log(
                        ((numBeads - index + numBeadsOmittedFromEnd) /
                            (numBeads + numBeadsOmittedFromEnd)) *
                            4 +
                            1
                    ) /
                        Math.log(5),
            })

            child.x = x
            child.y = y
            if (index === numBeads) {
                const [x, y] = bezier({
                    x0,
                    y0,
                    x1,
                    y1,
                    t: 1,
                })
                child.x = x
                child.y = y

                const [xPrior, yPrior] = bezier({
                    x0,
                    y0,
                    x1,
                    y1,
                    t:
                        1 -
                        Math.log(
                            ((numBeads - index + arrowEquivalentToNumBeads) /
                                numBeads) *
                                1.7 +
                                1
                        ),
                })

                child.rotation =
                    Math.atan((y - yPrior) / (x - xPrior)) +
                    (Math.PI / 2) * (x - xPrior > 0 ? 1 : -1)
            }
        })
    }
}

// t is 0 -> 1
function bezier({
    x0,
    y0,
    x1,
    y1,
    xA = x0 * 0.7 + x1 * 0.3,
    yA = y1 - 180,
    xB = x0 * 0.3 + x1 * 0.7,
    yB = y1 - 180,
    t,
}: {
    x0: number
    y0: number
    x1: number
    y1: number
    xA?: number
    yA?: number
    xB?: number
    yB?: number
    t: number
}): [number, number] {
    return [p(t, x0, xA, xB, x1), p(t, y0, yA, yB, y1)]

    function p(t: number, p1: number, p2: number, p3: number, p4: number) {
        return (
            (1 - t) ** 3 * p1 +
            3 * (1 - t) ** 2 * t * p2 +
            3 * (1 - t) * t ** 2 * p3 +
            t ** 3 * p4
        )
    }
}

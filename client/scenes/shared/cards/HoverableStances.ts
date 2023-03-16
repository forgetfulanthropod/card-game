import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    customGlowFilter,
    For,
    getStage,
    glowFilter,
    If,
    portalize,
    Sprite,
} from '@/elementsUtil'
import { nextFrame, toDatum } from '@/util'
import { compose, Datum, datum } from 'datums'
import { range, upperFirst } from 'lodash'
import { isMobile } from 'mobile-device-detect'
import { GlowFilter } from 'pixi-filters'
import { Filter } from 'pixi.js'
import { Card, StanceId } from 'shared'

export function HoverableStances(
    card: Card,
    hoveredStanceDatum: Datum<StanceId | null>
) {
    const characterCursor = getBattleScene().select(
        'allCharacters',
        card.characterUid
    )
    const stanceDatum = toDatum(characterCursor.select('stance'), id => id)
    const targetArrowTypeDatum = datum<StanceId | null>(null)
    const stanceToColorMap: Record<StanceId, number> = {
        avoidant: 0x48981d,
        neutral: 0xfece31,
        aggressive: 0xf63336,
    }

    return Container(
        {},
        For(
            compose(([currentStanceId]) => {
                const allStances: StanceId[] = [
                    'avoidant',
                    'neutral',
                    'aggressive',
                ]
                return allStances.map((id, index) => ({
                    key: `${id}${currentStanceId === id ? '-current' : ''}`,
                    id,
                    index,
                }))
            }, stanceDatum),
            stanceMeta => {
                const xOffset = (stanceMeta.index - 1) * 90
                const yOffset = stanceMeta.index === 1 ? 40 : 20
                const filters =
                    stanceMeta.id === characterCursor.get('stance')
                        ? [glowFilter]
                        : []

                const root = Sprite({
                    src: `stance${upperFirst(stanceMeta.id)}` as AssetKey,
                    filters,
                    anchor: 0.5,
                    scale: 0.55,
                    x: xOffset,
                    y: yOffset,
                    events: {
                        pointerdown() {
                            if (isMobile) {
                                // mobile drag
                            } else {
                                targetArrowTypeDatum.set(stanceMeta.id)
                                callApi('chooseStance', {
                                    stanceId: stanceMeta.id,
                                    characterUid: characterCursor.get('uid'),
                                })
                            }
                        },
                        pointerover() {
                            hoveredStanceDatum.set(stanceMeta.id)
                            root.filters = [
                                customGlowFilter(
                                    stanceToColorMap[stanceMeta.id],
                                    6
                                ),
                            ]
                        },
                        pointerout() {
                            hoveredStanceDatum.set(null)
                            const oldFilters = root.filters
                            root.filters = filters as Filter[]
                            // nextFrame().then(() =>
                            oldFilters?.forEach(f => f.destroy())
                            // )
                        },
                    },
                })

                return root
            }
        ),
        If(targetArrowTypeDatum, stance => TargetingArrow(stance))
    )
}

function TargetingArrow(stance: StanceId) {
    const numBeads = 20
    const arrowEquivalentToNumBeads = 4
    const numBeadsOmittedFromEnd = 1

    const content = Container(
        {},
        ...range(0, numBeads).map(i =>
            Sprite({
                src: 'targetingBead',
                name: `targetingBead-${i}`,
                anchor: 0.5,
                scale: 0.6 - ((numBeads - i) * 0.1) / numBeads,
            })
        ),
        Sprite({
            src: 'targetingArrow',
            name: 'targetingArrow',
            scale: 0.3,
            anchor: [0.5, 0],
        })
    )

    const root = Container({
        onDestroy: [
            () => getStage().off('pointermove', onPointerMove),
            () => content.destroy(true),
        ],
    })

    getStage().on('pointermove', onPointerMove)

    portalize({
        from: root,
        content,
    })

    return root

    function onPointerMove(e: any) {
        const pos = e.data.global
        updateArrow(pos.x, pos.y)
    }

    function updateArrow(x1: number, y1: number) {
        const x0 = BASE_WIDTH / 2
        const y0 = BASE_HEIGHT * 0.65

        content.children.forEach((child, index) => {
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

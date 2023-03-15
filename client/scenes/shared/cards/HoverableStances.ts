import { getBattleScene } from '@/data'
import {
    AssetKey,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    For,
    getStage,
    If,
    portalize,
    Sprite,
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { compose, datum } from 'datums'
import { range, upperFirst } from 'lodash'
import { isMobile } from 'mobile-device-detect'
import { Card, StanceId } from 'shared'

export function HoverableStances(card: Card) {
    const characterCursor = getBattleScene().select(
        'allCharacters',
        card.characterUid
    )
    const stanceDatum = toDatum(characterCursor.select('stance'), id => id)
    const stanceRadiculeDatum = datum<StanceId | null>(null)

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

                return Container(
                    {},
                    Sprite({
                        src: `stance${upperFirst(stanceMeta.id)}` as AssetKey,
                        anchor: 0.5,
                        scale: 0.55,
                        x: xOffset,
                        y: yOffset,
                        events: {
                            pointerdown() {
                                if (isMobile) {
                                    // mobile drag
                                } else {
                                    stanceRadiculeDatum.set(stanceMeta.id)
                                    // callApi('chooseStance', {
                                    //     stanceId: stanceMeta.id,
                                    //     characterUid:
                                    //         characterCursor.get('uid'),
                                    // })

                                    // target from stance
                                }
                            },
                            pointerover() {
                                // stance preview
                            },
                            pointerout() {
                                // end stance preview
                            },
                        },
                    })
                )
            }
        ),
        If(stanceRadiculeDatum, stance => TargetingArrow(stance))
    )
}

function TargetingArrow(stance: StanceId) {
    const numBeads = 20
    const arrowEquivalentToNumBeads = 2

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
        onDestroy: [() => getStage().off('pointermove', onPointerMove)],
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
                    Math.log10(
                        ((numBeads + arrowEquivalentToNumBeads - index) /
                            (numBeads + arrowEquivalentToNumBeads)) *
                            9 +
                            1
                    ),
            })

            if (index !== numBeads) {
                child.x = x
                child.y = y
            } else {
                const [x2, y2] = bezier({
                    x0,
                    y0,
                    x1,
                    y1,
                    t: 1,
                })

                child.x = x2
                child.y = y2

                child.rotation =
                    Math.atan((y2 - y) / (x2 - x)) +
                    (Math.PI / 2) * (x2 - x > 0 ? 1 : -1)
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

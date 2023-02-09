import { ROCursor } from 'sbaobab'
import { CharacterMeta, StanceId } from 'shared'
import { compose, Datum, datum } from 'datums'
import { isMobileOnly } from 'mobile-device-detect'
import { callApi } from '@/callApi'
import {
    If,
    getTexture,
    Container,
    Sprite,
    portalize,
    getStage,
    AssetKey,
} from '@/elementsUtil'
import { nextTick, onUpdate, toDatum } from '@/util'
import { last, upperFirst } from 'lodash'
import { HEALTH_BAR_WIDTH, spriteAnchor } from './HealthBar'
import { getNullAnimation } from '@/scenes/shared/cards/Card'
import { Tweener } from 'pixi-tweener'
import {
    Explanation,
    ExplanationIf,
    TermExplanation,
    TermExplanationIf,
} from '@sharedElements'

const STANCE_TEXTS: Record<StanceId, string[]> = {
    avoidant: ['Avoidant', 'take 25% less damage', 'deal 25% less damage'],
    neutral: ['Neutral', 'no modifier'],
    aggressive: ['Aggressive', 'deal 25% more damage', 'take 25% more damage'],
}

// [
//     'Stance modifiers',
//     'Aggressive: +25%',
//     'Neutral: 0%',
//     'Avoidant: -25%',
// ]
const stanceIds: StanceId[] = ['avoidant', 'neutral', 'aggressive']

export function StanceControls(characterCursor: ROCursor<CharacterMeta>) {
    const isHovered = datum(false)

    return Container(
        {},
        StanceBadge(characterCursor, isHovered),
        If(
            compose(
                ([isHovered, hasMoved]) => {
                    return isHovered && !hasMoved
                },
                isHovered,
                toDatum(characterCursor.select('hasMoved'), has => has)
            ),
            () => StanceChambers(characterCursor, isHovered)
        )
    )
}

function StanceBadge(
    characterCursor: ROCursor<CharacterMeta>,
    isHovered: Datum<boolean>
) {
    const badgeWidth = 100
    const characterDatum = toDatum(
        characterCursor,
        ({ isPc, stance, hasMoved, uid }) => {
            if (!isPc) return false
            return { stance, hasMoved, uid }
        }
    )

    return If(characterDatum, ({ hasMoved, stance }) => {
        const pointerover = () => {
            isHovered.set(true)
        }
        const pointerout = () => {
            if (hasMoved) isHovered.set(false)
        }

        const hasMovedDatum = toDatum(
            characterCursor.select('hasMoved'),
            has => has
        )
        return Container(
            {},
            If(hasMovedDatum, () =>
                Sprite({
                    src: `stance${upperFirst(stance)}Confirmed` as AssetKey,
                    scale:
                        badgeWidth / getTexture('stanceNeutralConfirmed').width,
                    x: getXOffset(),
                    anchor: 0.5,
                })
            ),
            Sprite({
                src: `stance${upperFirst(stance)}` as AssetKey,
                scale: 90 / getTexture('stanceNeutral').width,
                x: getXOffset(),
                anchor: 0.5,
                // alpha: 0.5,
                events: {
                    pointerover,
                    pointerdown: pointerover,
                    pointerout,
                    pointerup: pointerout,
                },
            }),
            ExplanationIf({
                isShown: compose(
                    ([hasMoved, isHovered]) => {
                        return hasMoved && isHovered
                    },
                    hasMovedDatum,
                    isHovered
                ) as unknown as Datum<boolean>,
                texts: [
                    `${STANCE_TEXTS[stance][0]} (locked)`,
                    STANCE_TEXTS[stance][1],
                ],
                xOffset: badgeWidth * 3,
            })
        )
    })
}

function StanceChambers(
    characterCursor: ROCursor<CharacterMeta>,
    isHovered: Datum<boolean>
) {
    if (characterCursor.get('isPc') === false) return Container({})

    const data = compose(
        ([stanceData]) => {
            return stanceData
        },
        toDatum(characterCursor, ({ isPc, stance, uid }) => {
            if (!isPc) return false
            return { stance, uid }
        })
    )

    const angleBetween = (Math.PI * 2) / 3
    let barrelAnim = getNullAnimation()
    let lastStance: StanceId = characterCursor.get('stance')
    const rotationForStance =
        angleBetween - angleBetween * stanceIds.indexOf(lastStance)
    const stanceBullets = StanceBullets(characterCursor, -rotationForStance)

    const root = Container(
        {
            x: getXOffset(),
            y: 50,
            rotation: rotationForStance,
            events: {
                pointerdown() {
                    if (isMobileOnly) {
                        setTimeout(() => isHovered.set(false), 500)
                    }
                },
                pointerout() {
                    isHovered.set(false)
                },
            },
            onDestroy: [
                () => {
                    Tweener.killTweensOf(root)
                    stanceBullets.forEach(b => Tweener.killTweensOf(b))
                },
                onUpdate(characterCursor.select('stance'), stance => {
                    //animate cylinder
                    const currentIndex = stanceIds.indexOf(lastStance)
                    const nextIndex = stanceIds.indexOf(stance)
                    const indexDifference = currentIndex - nextIndex
                    const numberOfTurns =
                        indexDifference === -1
                            ? 2
                            : indexDifference > 0
                            ? indexDifference
                            : 1

                    if (currentIndex === nextIndex) return

                    //[avoidant, neutral, aggr00]
                    barrelAnim = barrelAnim.then(() => {
                        const rotation =
                            root.rotation + angleBetween * numberOfTurns

                        stanceBullets.forEach(b =>
                            Tweener.add(
                                { target: b, duration: 0.15 },
                                {
                                    rotation: -rotation,
                                }
                            )
                        )

                        return Tweener.add(
                            { target: root, duration: 0.15 },
                            {
                                rotation,
                            }
                        )
                    })

                    lastStance = stance
                    //counter-animate bullets
                }),
            ],
        },
        Sprite({
            src: 'stanceCylinder',
            anchor: 0.5,
        }),
        ...stanceBullets
    )

    return root
}

function StanceBullets(
    characterCursor: ROCursor<CharacterMeta>,
    rotation: number
) {
    const width = HEALTH_BAR_WIDTH * 0.27
    const stanceSrcForSizing = getTexture('stanceAvoidant')

    const scale: number = width / stanceSrcForSizing.width
    const cylinderMidRadius = getTexture('stanceCylinder').width * 0.26

    const bottomChamberAngle = (Math.PI / 2) * 0.33
    const xOffset = cylinderMidRadius * Math.cos(bottomChamberAngle)

    const hoveredStanceId = datum<null | StanceId>(null)

    const stanceBullets = stanceIds.map((stanceId, i) =>
        Sprite({
            src: `stance${upperFirst(stanceId)}` as AssetKey,
            anchor: 0.5,
            scale,
            x: -xOffset + xOffset * i,
            y:
                i == 1
                    ? -cylinderMidRadius
                    : cylinderMidRadius * Math.sin(bottomChamberAngle),
            rotation,
            events: {
                pointerover() {
                    hoveredStanceId.set(stanceId)
                },
                pointerdown() {
                    hoveredStanceId.set(stanceId)
                },
                pointerup() {
                    hoveredStanceId.set(null)

                    const selectedStanceId = characterCursor.get('stance')
                    const stanceIndex = stanceIds.indexOf(selectedStanceId)

                    // console.log(
                    //     selectedStanceId === stanceId
                    //         ? 'toggling'
                    //         : 'setting to ' + stanceId
                    // )
                    void callApi('chooseStance', {
                        characterUid: characterCursor.get('uid'),
                        stanceId:
                            selectedStanceId === stanceId
                                ? stanceIds[
                                      stanceIndex > 0
                                          ? stanceIndex - 1
                                          : stanceIds.length - 1
                                  ]
                                : stanceId,
                    })
                },
            },
        })
    )

    const explanation = If(
        compose(([stanceId]) => {
            if (!stanceId) return false

            return STANCE_TEXTS[stanceId]
        }, hoveredStanceId),
        (texts: string[]) => {
            const root = Container({})

            nextTick().then(() => {
                if (root == null) return

                portalize({
                    from: root,
                    to: () => getStage(),
                    content: Explanation({
                        texts,
                        displayObjectArgs: {
                            x: root.getGlobalPosition().x + width * 1.5,
                            y: root.getGlobalPosition().y + -0.6 * width,
                            padding: 15,
                            borderThickness: 2,
                        },
                    }),
                })
            })

            return root
        }
    )

    explanation.rotation = rotation

    return [...stanceBullets, explanation]
}

function getXOffset() {
    return getTexture('healthBarAggressive').width * 1.07
}

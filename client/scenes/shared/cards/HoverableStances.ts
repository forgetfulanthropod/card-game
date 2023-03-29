import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    AssetKey,
    Container,
    customGlowFilter,
    For,
    Sprite,
} from '@/elementsUtil'
import { getIsStanceLockedDatum } from '@/scenes/run/character/StanceControls'
import { toDatum } from '@/util'
import { compose, Datum } from 'datums'
import { upperFirst } from 'lodash'
import { GrayscaleFilter } from 'pixi-filters'
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
    // const targetArrowTypeDatum = datum<StanceId | null>(null)
    const stanceToColorMap: Record<StanceId, number> = {
        avoidant: 0x48981d,
        neutral: 0xfece31,
        aggressive: 0xf63336,
    }

    return Container(
        {},
        For(
            compose(
                ([currentStanceId, isLocked]) => {
                    const allStances: StanceId[] = [
                        'avoidant',
                        'neutral',
                        'aggressive',
                    ]
                    return allStances.map((id, index) => ({
                        key: `${id}${currentStanceId === id ? '-current' : ''}`,
                        id,
                        index,
                        isLocked,
                    }))
                },
                stanceDatum,
                getIsStanceLockedDatum(characterCursor)
            ),
            stanceMeta => {
                const xyrs = {
                    x: (stanceMeta.index - 1) * 90,
                    y: stanceMeta.index === 1 ? -18 : -8,
                    rotation: (stanceMeta.index - 1) * 0.125 * Math.PI,
                    scale: 0.6,
                }

                const characterIsInThisStance =
                    stanceMeta.id === characterCursor.get('stance')
                const isLockedToThisStance =
                    characterIsInThisStance && stanceMeta.isLocked
                const filters =
                    characterIsInThisStance && !isLockedToThisStance
                        ? [customGlowFilter(stanceToColorMap[stanceMeta.id], 6)]
                        : stanceMeta.isLocked && !characterIsInThisStance
                        ? [new GrayscaleFilter()]
                        : []

                const root = Container(
                    {},
                    ...(isLockedToThisStance
                        ? [
                              Sprite({
                                  src: `stance${upperFirst(
                                      stanceMeta.id
                                  )}Confirmed` as AssetKey,
                                  filters,
                                  anchor: 0.5,
                                  ...xyrs,
                              }),
                          ]
                        : []),
                    Sprite({
                        src: `stance${upperFirst(stanceMeta.id)}` as AssetKey,
                        filters,
                        anchor: 0.5,
                        ...xyrs,
                        events: {
                            pointerdown() {
                                //todo: mobile tap to preview, drag detect
                                if (!isLockedToThisStance)
                                    callApi('chooseStance', {
                                        stanceId: stanceMeta.id,
                                        characterUid:
                                            characterCursor.get('uid'),
                                    })
                            },
                            pointerenter() {
                                hoveredStanceDatum.set(stanceMeta.id)

                                if (!characterIsInThisStance)
                                    root.filters = [
                                        customGlowFilter(
                                            stanceToColorMap[stanceMeta.id],
                                            6
                                        ),
                                    ]
                            },
                            pointerout() {
                                hoveredStanceDatum.set(null)

                                if (!characterIsInThisStance) {
                                    root.filters = filters
                                }
                            },
                        },
                    })
                )

                return root
            }
        )
    )
}

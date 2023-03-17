import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    AssetKey,
    Container,
    customGlowFilter,
    For,
    glowFilter,
    If,
    Sprite,
} from '@/elementsUtil'
import { getIsStanceLockedDatum } from '@/scenes/run/character/StanceControls'
import { nextFrame, toDatum } from '@/util'
import { compose, Datum, datum } from 'datums'
import { getCurrentScope } from 'immer/dist/internal'
import { upperFirst } from 'lodash'
import { isMobile } from 'mobile-device-detect'
import { GrayscaleFilter } from 'pixi-filters'
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
                const xOffset = (stanceMeta.index - 1) * 90
                const yOffset = stanceMeta.index === 1 ? 35 : 23
                const characterIsInThisStance =
                    stanceMeta.id === characterCursor.get('stance')
                const isLockedToThisStance =
                    characterIsInThisStance && stanceMeta.isLocked
                const filters =
                    characterIsInThisStance && !isLockedToThisStance
                        ? [glowFilter]
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
                                  scale: 0.55,
                                  x: xOffset,
                                  y: yOffset,
                              }),
                          ]
                        : []),
                    Sprite({
                        src: `stance${upperFirst(stanceMeta.id)}` as AssetKey,
                        filters,
                        anchor: 0.5,
                        scale: 0.55,
                        x: xOffset,
                        y: yOffset,
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

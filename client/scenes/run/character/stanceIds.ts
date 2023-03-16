import { ROCursor } from 'sbaobab'
import { CharacterMeta, StanceId } from 'shared'
import { compose, datum } from 'datums'
import { isMobileOnly } from 'mobile-device-detect'
import { callApi } from '@/callApi'
import { If, getTexture, Container, Sprite, AssetKey } from '@/elementsUtil'
import { toDatum } from '@/util'
import { upperFirst } from 'lodash'
import { HEALTH_BAR_WIDTH, spriteAnchor } from './HealthBar'

const stanceIds: StanceId[] = ['avoidant', 'neutral', 'aggressive']
export function StanceChambers(characterCursor: ROCursor<CharacterMeta>) {
    const isHovered = datum(false)
    const data = compose(
        ([stanceData]) => {
            return stanceData
        },
        toDatum(characterCursor, ({ isPc, stance, uid }) => {
            if (!isPc) return false
            return { stance, uid }
        })
    )

    const width = HEALTH_BAR_WIDTH * 0.27
    const stanceSrcForSizing = getTexture('stanceAvoidant')
    const scale: number = width / stanceSrcForSizing.width

    if (characterCursor.get('isPc') === false) return Container({})

    return Container(
        {
            x: HEALTH_BAR_WIDTH * 0.82,
        },
        // ExplanationBox({
        //     texts: STANCE_TEXTS,
        //     displayObjectArgs: {
        //         borderThickness: 2,
        //         borderColor: 0x78726a,
        //         fontSize: 30,
        //         y: height * -0.04,
        //         x: width * 0.06,
        //     },
        // }),
        ...stanceIds.map((stanceId, i) =>
            Sprite({
                src: `stance${upperFirst(stanceId)}` as AssetKey,
                anchor: 0.5,
                scale,
                x: -40 + 80 * i,
                y: 55,
                events: {
                    pointerenter() {
                        isHovered.set(true)
                    },
                    pointerdown() {
                        const selectedStanceId = characterCursor.get('stance')
                        void callApi('chooseStance', {
                            characterUid: characterCursor.get('uid'),
                            stanceId:
                                selectedStanceId === stanceId
                                    ? stanceIds[
                                          stanceIds.indexOf(selectedStanceId) -
                                              1 || stanceIds.length - 1
                                      ]
                                    : stanceId,
                        })
                        if (isMobileOnly) {
                            isHovered.set(false)
                        }
                    },
                    pointerleave() {
                        isHovered.set(false)
                    },
                },
            })
        )
    )
}
export function StanceBarIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })

    return If(data, ({ stance }) =>
        Sprite({
            src: `healthBar${upperFirst(stance)}` as AssetKey,
            anchor: spriteAnchor,
        })
    )
}
export function StanceBadge(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })
    const healthBarTexture = getTexture('healthBarAggressive')

    return If(data, ({ stance }) => {
        return Sprite({
            src: `stance${upperFirst(stance)}` as AssetKey,
            scale: 90 / getTexture('stanceNeutral').width,
            x: healthBarTexture.width * 0.92,
            anchor: [0, 0.5],
            // alpha: 0.5,
        })
    })
}

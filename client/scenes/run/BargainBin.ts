import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    For,
    If,
    Sprite,
    Text,
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { compose, datum } from 'datums'
import { Texture } from 'pixi.js'
import { Souvenir, souvenirMap } from 'shared'
import { vals } from 'shared/code'
import { EquipSouvenirInterface, EventResponse } from './EventScene'
import { SouvenirEl } from './Souvenirs'

export function BargainBin() {
    const isBargainBinOpen = datum(false)
    const souvenirNeedingCharacterSelect = datum<Souvenir | null>(null)
    return If(
        isBargainBinOpen,
        () => {
            const souvenirsCursor = getBattleScene().select('souvenirs')
            const allSouvenirs = vals(souvenirMap)

            const choiceDatum = datum<EventResponse>({
                index: 0,
                characterUid: undefined,
            })

            return Container(
                {},
                Sprite({
                    src: Texture.WHITE,
                    tint: 0,
                    alpha: 0.5,
                    width: BASE_WIDTH,
                    height: BASE_HEIGHT,
                }),
                For(
                    toDatum(souvenirsCursor, collectedSouvenirs =>
                        allSouvenirs
                            .filter(
                                s =>
                                    !collectedSouvenirs
                                        .map(s => s.id)
                                        .includes(s.id)
                            )
                            .map((s, index) => ({ key: s.id, index, ...s }))
                    ),
                    souvenir =>
                        Adjust(
                            SouvenirEl({
                                souvenir,
                                width: 140,
                                displayArgs: {
                                    events: {
                                        pointerup() {
                                            if (souvenir.equippable)
                                                souvenirNeedingCharacterSelect.set(
                                                    souvenir
                                                )
                                            else
                                                callApi('getFreeSouvenir', {
                                                    souvenirId: souvenir.id,
                                                })
                                        },
                                    },
                                },
                            }),
                            {
                                x:
                                    BASE_HEIGHT * 0.2 +
                                    140 * (souvenir.index % 12),
                                y:
                                    BASE_HEIGHT * 0.2 +
                                    140 * Math.floor(souvenir.index / 12),
                            }
                        )
                ),
                If(
                    souvenirNeedingCharacterSelect,
                    souvenir => EquipSouvenirInterface(souvenir, choiceDatum),
                    undefined,
                    {
                        onDestroy: (() =>
                            choiceDatum.onChange(choice => {
                                if (!choice.characterUid) return

                                const souvenirId =
                                    souvenirNeedingCharacterSelect.val?.id
                                souvenirId &&
                                    callApi('getFreeSouvenir', {
                                        souvenirId,
                                        characterUid: choice.characterUid,
                                    })
                                souvenirNeedingCharacterSelect.set(null)
                            }))(),
                    }
                ),
                Text({
                    text: 'close bargain bin',
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT,
                    anchor: [1.5, 2],
                    style: {
                        fill: 'white',
                    },
                    events: {
                        pointerdown() {
                            isBargainBinOpen.set(false)
                        },
                    },
                })
            )
        },
        () =>
            Sprite({
                src: 'mapBargainBin',
                x: BASE_WIDTH,
                y: BASE_HEIGHT,
                anchor: [1, 1],
                events: {
                    pointerdown() {
                        isBargainBinOpen.set(true)
                    },
                },
            })
    )
}

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
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { compose, Datum, datum } from 'datums'
import { DisplayObject, Texture } from 'pixi.js'
import { Souvenir, souvenirMap } from 'shared'
import { vals } from 'shared/code'
import { MainCharacterAnimation, PlainButton } from '../shared'
import { CardsTiltedInLineForCharacter } from '../shared/cards/CardsTiltedInLine'
import { EquipSouvenirInterface, EventResponse } from './EventScene'
import { SouvenirEl } from './Souvenirs'

export function BargainBin() {
    const isBargainBinOpen = datum(false)
    const souvenirsOrCards = datum<'souvenirs' | 'cards'>('souvenirs')
    const souvenirNeedingCharacterSelect = datum<Souvenir | null>(null)
    return Container(
        {},
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
        }),
        If(isBargainBinOpen, () => {
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
                    events: {
                        pointerdown() {
                            isBargainBinOpen.set(false)
                        },
                    },
                }),
                PlainButton({
                    text: 'Souvenirs',
                    x: BASE_WIDTH * 0.4,
                    y: BASE_HEIGHT * 0.1,
                    onClick() {
                        souvenirsOrCards.set('souvenirs')
                    },
                }),
                PlainButton({
                    text: 'Cards',
                    x: BASE_WIDTH * 0.55,
                    y: BASE_HEIGHT * 0.1,
                    onClick() {
                        souvenirsOrCards.set('cards')
                    },
                }),
                If(
                    compose(
                        ([souvenirsOrCards]) =>
                            souvenirsOrCards === 'souvenirs',
                        souvenirsOrCards
                    ),
                    () => {
                        return BargainSouvenirs(souvenirNeedingCharacterSelect)
                    }
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
                If(
                    compose(
                        ([souvenirsOrCards]) => souvenirsOrCards === 'cards',
                        souvenirsOrCards
                    ),
                    () => BargainCards()
                )
            )
        })
    )
}

function BargainSouvenirs(
    souvenirNeedingCharacterSelect: Datum<Souvenir | null>
) {
    const souvenirsCursor = getBattleScene().select('souvenirs')
    const allSouvenirs = vals(souvenirMap)

    return For(
        toDatum(souvenirsCursor, collectedSouvenirs =>
            allSouvenirs
                .filter(s => !collectedSouvenirs.map(s => s.id).includes(s.id))
                .map((s, index) => ({
                    key: s.id,
                    index,
                    ...s,
                }))
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
                                    souvenirNeedingCharacterSelect.set(souvenir)
                                else
                                    callApi('getFreeSouvenir', {
                                        souvenirId: souvenir.id,
                                    })
                            },
                        },
                    },
                }),
                {
                    x: BASE_HEIGHT * 0.2 + 140 * (souvenir.index % 12),
                    y:
                        BASE_HEIGHT * 0.3 +
                        140 * Math.floor(souvenir.index / 12),
                }
            )
    )
}

function BargainCards(): DisplayObject {
    return For(
        toDatum(getBattleScene().select('allCharacters'), ac => {
            return vals(ac)
                .filter(c => c.isPc && c.health > 0)
                .map(c => ({ ...c, key: c.uid }))
        }),
        c => {
            return Container(
                {},
                CardsTiltedInLineForCharacter(c, 'pool', card => {
                    callApi('getFreeCard', { card })
                }),
                Adjust(
                    CardsTiltedInLineForCharacter(c, 'deck', card => {
                        callApi('removeCardForFree', { uid: card.uid })
                    }),
                    {
                        y: 200,
                    }
                ),
                Adjust(MainCharacterAnimation({ characterMeta: c })!, {
                    y: BASE_HEIGHT * 0.6,
                    x: BASE_WIDTH * 0.15,
                })
            )
        },
        i => {
            return {
                y: BASE_HEIGHT * 0.3,
                x: BASE_WIDTH * 0.03 + i * BASE_WIDTH * 0.33,
            }
        }
    )
}

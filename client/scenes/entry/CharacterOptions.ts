import type {
    CharacterId,
    CharacterPlaceIndex,
    CharacterStats,
    CharacterUid,
    OwnedCharacterStats,
    SelectedCharacters,
} from 'shared'
import { range } from 'lodash'
import { datum } from 'datums'
import {
    RoundedBordered,
    Container,
    getTexture,
    Sprite,
    glowFilter,
    AssetKey,
    Adjust,
    Text,
    fontMap,
} from '@/elementsUtil'
import { callApi } from '@/callApi'
import {
    hoveredCharacterStatsOverride,
    hoveredCharacterUid,
    onUpdate,
} from '@/util'
import { getEntryScene } from '@/data'
import { AdjustmentFilter, OutlineFilter } from 'pixi-filters'
import { InfoBox } from '../shared'

export const selectedCharacterId = datum<null | CharacterId>(null)
export const selectedCharacterPlaceIndex = datum<CharacterPlaceIndex>(2)

export function CharacterOptions() {
    const grayScaleFilter = new AdjustmentFilter({
        saturation: 0,
    })
    const allCharacterOptions = getEntryScene().get('allCharacterOptions')

    let lastHoveredCharacterUid: CharacterUid | null = null
    const options = allCharacterOptions.map((c, index) => {
        const width = 115
        const margin = width * 0.2
        const src = getTexture(`${c.id}Profile` as AssetKey)

        // All plain characters from entryState / playerCharacterStatsMap (for viewing the full selection)
        const validOptions: readonly CharacterId[] = [
            'frogKnight',
            'gnomeHooligan',
            'warhog',
            'notoriousBean',
            'penguinKnight',
            'skeletonWarrior',
            'matchaGelatinCube',
            'mushroomFarmer',
            'snacky',
            'jerry',
            // add any others from full list if more become available
        ] as const
        const isValidOption = validOptions.includes(c.id)

        // const isNewCharacter = ['notoriousBean'].includes(c.id)
        const isNewCharacter = false

        return Container(
            {
                x: 78 + (index % 2) * (width + margin),
                y: 54 + Math.floor(index / 2) * (width + margin),
                events: {
                    pointerenter() {
                        hoveredCharacterStatsOverride.set(c)
                    },
                    pointerleave() {
                        hoveredCharacterStatsOverride.set(null)
                    },
                    pointerup() {
                        if (!isValidOption) {
                            return
                        }
                        chooseOwnedCharacterAt(
                            index,
                            selectedCharacterPlaceIndex.val
                        )

                        setTimeout(() => {
                            if (
                                getEntryScene()
                                    .get('selectedCharacters')
                                    .filter(c => c != null).length < 3
                            )
                                selectedCharacterPlaceIndex.set(
                                    ((selectedCharacterPlaceIndex.val + 1) %
                                        3) as CharacterPlaceIndex
                                )
                        }, 100)
                    },
                },
            },
            Adjust(
                Container(
                    {},
                    RoundedBordered(
                        Sprite({
                            src,
                            scale: width / src.width,
                        }),
                        {
                            radius: 20,
                            borderThickness: 6,
                            borderColor: 0,
                        }
                    ),
                    isNewCharacter &&
                        Adjust(NewCharacterIcon(), {
                            x: 31,
                            y: 105,
                        })
                ),
                {
                    filters: isValidOption ? [] : [grayScaleFilter],
                }
            )
        )
    })

    return Container(
        {
            onDestroy: [
                selectedCharacterId.onChange(id => {
                    options.forEach(o => (o.filters = []))
                    if (id == null || hoveredCharacterUid.val == null) return

                    const i = allCharacterOptions.findIndex(c => c.id === id)
                    options[i].filters = [glowFilter]
                }, true),
                hoveredCharacterUid.onChange(uid => {
                    const hoveredCharacterMeta = getEntryScene()
                        .get('selectedCharacters')
                        .find((c, i) => {
                            const isMatch = c?.uid === uid
                            if (isMatch)
                                selectedCharacterPlaceIndex.set(
                                    i as CharacterPlaceIndex
                                )
                            return isMatch
                        })

                    selectedCharacterId.set(hoveredCharacterMeta?.id ?? null)
                }),
                onUpdate(getEntryScene().select('selectedCharacters'), sc => {
                    if (sc == null) return

                    const hoveredCharacterMeta =
                        sc[selectedCharacterPlaceIndex.val]

                    hoveredCharacterUid.set(hoveredCharacterMeta?.uid ?? null)

                    selectedCharacterId.set(hoveredCharacterMeta?.id ?? null)
                }),
            ],
        },
        ...options
    )
}

function chooseOwnedCharacterAt(
    allCharacterOptionsIndex: number,
    selectedCharacterPlaceIndex: CharacterPlaceIndex
) {
    void callApi('placeSelectedCharacters', {
        characters: [
            {
                allCharacterOptionsIndex,
                placeIndex: selectedCharacterPlaceIndex,
            },
        ],
    })
}

export const rollKaijuAtPlace = () => {
    void callApi('rollKaiju', {
        placeIndex: selectedCharacterPlaceIndex.val,
    })
}

export async function composeDefaultParty() {
    const defaultCharacterOptionsIndices = [3, 2, 0]
    void callApi('placeSelectedCharacters', {
        characters: range(0, 3).map(placeIndex => ({
            allCharacterOptionsIndex:
                defaultCharacterOptionsIndices[placeIndex],
            placeIndex: placeIndex as CharacterPlaceIndex,
        })),
    })
}

export function NewCharacterIcon() {
    return InfoBox(
        Container(
            {},
            Text({
                text: '     NEW    ',
                style: {
                    fill: 'white',
                    fontFamily: fontMap['bigFont'],
                    fontSize: 16,
                },
            })
        ),
        {
            padding: 3,
            colorStops: [
                { color: 0xfe2027, offset: 0 },
                { color: 0xff4d00, offset: 1 },
            ],
            alpha: 1,
            borderRadius: 12,
            filters: [new OutlineFilter(2, 0xffebeb)],
        }
    )
}

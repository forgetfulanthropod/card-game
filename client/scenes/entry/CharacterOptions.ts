import type {
    CharacterId,
    CharacterPlaceIndex,
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
} from '@/elementsUtil'
import { callApi } from '@/callApi'
import { hoveredCharacterUid, onUpdate } from '@/util'
import { getEntryScene } from '@/data'

const defaultOwnedCharacters: OwnedCharacterStats[] = [
    {
        id: 'frogKnight',
        displayName: 'Frog Knight',
        isPc: true,
        class: 'knight',

        constitution: 80,
        strength: 10,
        magic: 5,
        defense: 11,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'mushroomFarmer',
        displayName: 'Mushroom Farmer',
        isPc: true,
        class: 'cleric',
        constitution: 112,
        strength: 8,
        magic: 9,
        defense: 6,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'penguinKnight',
        displayName: 'Penguin Knight',
        isPc: true,
        class: 'knight',

        constitution: 74,
        strength: 12,
        magic: 5,
        defense: 9,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'skeletonWarrior',
        displayName: 'Skeleton Warrior',
        isPc: true,
        class: 'knight',

        constitution: 54 + 4,
        strength: 11 + 3,
        magic: 4,
        defense: 4 + 3,
        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'matchaGelatinCube',
        displayName: 'Matcha Gelatin Cube',
        isPc: true,
        class: 'cleric',

        constitution: 78 + 25,
        strength: 5 + 1,
        magic: 7 + 2,
        defense: 5 + 4,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'warhog',
        displayName: 'Warhog',
        isPc: true,
        class: 'cleric',

        constitution: 84,
        strength: 6,
        magic: 4,
        defense: 8,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'gnomeHooligan',
        displayName: 'Gnome Hooligan',
        isPc: true,
        class: 'rogue',

        constitution: 40,
        strength: 12 + 1, //drew did it
        magic: 14,
        defense: 5,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'jerry',
        displayName: 'Jerry',
        isPc: true,
        class: 'wizard',

        constitution: 86,
        strength: 19,
        magic: 8 + 1,
        defense: 5 + 1,

        uid: '',
        tokenId: '',
        nftName: '',
    },
]

export const selectedCharacterId = datum<null | CharacterId>(null)
export const selectedCharacterPlaceIndex = datum<CharacterPlaceIndex>(2)

export function CharacterOptions() {
    const options = defaultOwnedCharacters.map((c, index) => {
        const width = 115
        const margin = width * 0.2
        const src = getTexture(`${c.id}Profile` as AssetKey)

        return Container(
            {
                x: 78 + (index % 2) * (width + margin),
                y: 54 + Math.floor(index / 2) * (width + margin),
                events: {
                    pointerup() {
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
            )
        )
    })

    return Container(
        {
            onDestroy: [
                selectedCharacterId.onChange(id => {
                    options.forEach(o => (o.filters = []))
                    if (id == null || hoveredCharacterUid.val == null) return

                    const i = defaultOwnedCharacters.findIndex(c => c.id === id)
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
    ownedCharacterIndex: number,
    selectedCharacterPlaceIndex: CharacterPlaceIndex
) {
    const uid = `pc-${ownedCharacterIndex}-${(Math.random() * 10000) | 0}`

    void callApi('placeSelectedCharacters', {
        characters: [
            {
                character: {
                    ...defaultOwnedCharacters[ownedCharacterIndex],
                    uid,
                },
                index: selectedCharacterPlaceIndex,
            },
        ],
    })
}

async function _fillUnselectedSlots(charactersData: SelectedCharacters) {
    if (charactersData[2]) return

    const additions = range(1)
        .filter(i => charactersData[i] == null)
        .map(i => ({
            character: defaultOwnedCharacters[i],
            index: 1 as CharacterPlaceIndex,
        }))
    await callApi('placeSelectedCharacters', { characters: additions })
}

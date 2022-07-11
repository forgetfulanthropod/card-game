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
} from '@/elementsUtil'
import { callApi } from '@/callApi'
import { hoveredCharacterUid } from '@/util'

const defaultOwnedCharacters: OwnedCharacterStats[] = [
    {
        id: 'frogKnight',
        displayName: 'Frog Knight',
        isPc: true,
        class: 'knight',
        constitution: 72,
        strength: 8,
        wisdom: 5,
        defense: 5,

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
        wisdom: 9,
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

        constitution: 66,
        strength: 9,
        wisdom: 5,
        defense: 5,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'skeletonWarrior',
        displayName: 'Skeleton Warrior',
        isPc: true,
        class: 'knight',

        constitution: 54,
        strength: 11,
        wisdom: 4,
        defense: 4,
        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'matchaGelatinCube',
        displayName: 'Matcha Gelatin Cube',
        isPc: true,
        class: 'wizard',

        constitution: 78,
        strength: 5,
        wisdom: 7,
        defense: 5,

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
        wisdom: 4,
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
        strength: 12,
        wisdom: 12,
        defense: 3,

        uid: '',
        tokenId: '',
        nftName: '',
    },
    {
        id: 'jerry',
        displayName: 'Jerry',
        isPc: true,
        class: 'bard',

        constitution: 86,
        strength: 5,
        wisdom: 20,
        defense: 9,

        uid: '',
        tokenId: '',
        nftName: '',
    },
]

export const selectedCharacterId = datum<null | CharacterId>(null)
export const selectedCharacterPlaceIndex = datum<null | CharacterPlaceIndex>(
    null
)

export function CharacterOptions() {
    const options = defaultOwnedCharacters.map((c, index) => {
        const width = 115
        const margin = width * 0.2
        const src = getTexture(`${c.id}Profile`)
        // const src = getTexture(`frogKnightProfile`)

        return Container(
            {
                x: 78 + (index % 2) * (width + margin),
                y: 54 + Math.floor(index / 2) * (width + margin),
                // x:
                //     BASE_WIDTH * 0.508 +
                //     (-defaultOwnedCharacters.length / 2 + index) *
                //         (width + margin),
                // y: BASE_HEIGHT * 0.88,
                events: {
                    pointerup() {
                        if (selectedCharacterPlaceIndex.val == null)
                            throw new Error(
                                'trying to choose but no place index...'
                            )

                        selectedCharacterId.set(c.id)
                        chooseOwnedCharacterAt(
                            index,
                            selectedCharacterPlaceIndex.val
                        )
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
                    if (id == null) return

                    const i = defaultOwnedCharacters.findIndex(c => c.id === id)
                    options[i].filters = [glowFilter]
                }, true),
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

    hoveredCharacterUid.set(uid)

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

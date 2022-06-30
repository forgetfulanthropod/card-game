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

        uid: 'pc-2',
        tokenId: '4',
        nftName: 'frogKnight-4',
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

        uid: 'pc-3',
        tokenId: '4',
        nftName: 'mushroomFarmer-4',
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
        uid: 'pc-1',
        tokenId: '4',
        nftName: 'skeletonWarrior-4',
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

        uid: 'pc-4',
        tokenId: '4',
        nftName: 'matchaGelatinCube-4',
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

        uid: 'pc-4',
        tokenId: '4',
        nftName: 'warhog-4',
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

        uid: 'pc-4',
        tokenId: '4',
        nftName: 'matchaGelatinCube-4',
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

        uid: 'pc-4',
        tokenId: '4',
        nftName: 'matchaGelatinCube-4',
    },
]

export const selectedCharacterId = datum<null | CharacterId>('frogKnight')

export function CharacterOptions() {
    const options = defaultOwnedCharacters.map((c, index) => {
        const width = 180
        const margin = width * 0.2
        const src = getTexture(`${c.id}Profile`)
        // const src = getTexture(`frogKnightProfile`)

        return Container(
            {
                x: 50 + (index % 2) * (width + margin),
                y: 50 + Math.floor(index / 2) * (width + margin),
                events: {
                    pointerup() {
                        chooseOwnedCharacterAt(index)
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
                    else {
                        const i = defaultOwnedCharacters.findIndex(
                            c => c.id === id
                        )
                        options[i].filters = [glowFilter]
                    }
                }, true),
            ],
        },
        ...options
    )
}

const currentCharacterPlaceIndex = datum<CharacterPlaceIndex>(0)

function chooseOwnedCharacterAt(ownedCharacterIndex: number) {
    void callApi('placeSelectedCharacters', {
        characters: [
            {
                character: {
                    ...defaultOwnedCharacters[ownedCharacterIndex],
                    uid: `pc-${ownedCharacterIndex}`,
                },
                index: currentCharacterPlaceIndex.val,
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

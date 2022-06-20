import { OldFilmFilter } from 'pixi-filters'
import type { CharacterPlaceIndex, OwnedCharacterStats } from 'shared'

import { range } from 'lodash'
import { MainCharacterAnimation } from '@sharedElements'
import { callApi } from '@/callApi'
import { getEntryScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import {
    isTextureKey,
    PixiTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
} from '@/elementsUtil'
import { brightBackLightIsShining, hoveredCharacterUid, onUpdate } from '@/util'

const defaultOwnedCharacters: OwnedCharacterStats[] = [
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
        id: 'matchaGelatinCube',
        displayName: 'Matcha Gelatin Cube',
        isPc: true,
        class: 'wizard',

        constitution: 78,
        strength: 7,
        wisdom: 5,
        defense: 5,

        uid: 'pc-4',
        tokenId: '4',
        nftName: 'matchaGelatinCube-4',
    },
]

// const preselectFilter = new AdjustmentFilter({
//     contrast: 0,
//     alpha: 0.542,
//     // gamma: 1,
//     // saturation: 1.755,
//     // brightness: 1,
//     // red: 1,
//     // green: 1,
//     // blue: 1,
// })

const darkenFilter = new OldFilmFilter({
    sepia: 0,
    noise: 0,
    noiseSize: 1,
    scratch: 0.5,
    scratchDensity: 0.3,
    scratchWidth: 1,
    vignetting: 0.8,
    vignettingAlpha: 0.669,
    vignettingBlur: 0.3,
})

export function SelectedCharacters(): PixiContainer {
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    const root = Container({
        x: 0.5 * BASE_WIDTH,
        y: 0.77 * BASE_HEIGHT,
        onDestroy: [
            onUpdate(selectedCharacters, characters => {
                if (characters != null) setSelectedCharacters()
            }),
        ],
    })

    const listenerStack: (() => void)[] = []
    setSelectedCharacters()

    return root

    function setSelectedCharacters() {
        const charactersData = [...selectedCharacters.get()]

        void fillUnselectedSlots(charactersData)

        const characterHeight = 260
        const characters =
            charactersData
                .filter(c => c != null)
                .map((c, i) => {
                    const props = {
                        x: i === 0 ? -200 : i === 2 ? 0 : 200,
                        y: i === 2 ? 43 : 0,
                        scale: i === 2 ? 1.1 : 1,
                    } as const
                    return [
                        Container(
                            {
                                ...props,
                            },

                            MainCharacterAnimation({
                                characterMeta: c,
                                events: {
                                    pointerout() {},
                                    pointerdown() {
                                        if (hoveredCharacterUid.val === c.uid)
                                            toggleSelectedCharacter(c, i)

                                        hoveredCharacterUid.set(c.uid)
                                    },
                                },
                                height: characterHeight,
                            }) ??
                                Sprite({
                                    anchor: [0.5, 0.5],
                                    src: isTextureKey(c.id)
                                        ? getTexture(c.id)
                                        : PixiTexture.WHITE,
                                    scale: 1,
                                })
                        ),
                    ]
                })
                .flat() ?? []
        listenerStack.pop()?.()

        listenerStack.push(
            brightBackLightIsShining.onChange((is, _, unsub) => {
                if (is) unsub()

                characters.forEach(c => (c.filters = is ? [darkenFilter] : []))
            })
        )

        root.removeChildren()
        if (Array.isArray(characters) && characters.length > 0)
            root.addChild(...characters)
        root.sortChildren()
    }
}

function toggleSelectedCharacter(c: OwnedCharacterStats, i: number) {
    const nextIndex =
        (defaultOwnedCharacters.findIndex(oc => oc.id === c.id) + 1) %
        defaultOwnedCharacters.length
    const nextChoice = defaultOwnedCharacters[nextIndex]
    // console.log({ nextIndex, nextChoice })
    void callApi('placeSelectedCharacters', {
        characters: [
            {
                character: {
                    ...nextChoice,
                    uid: `pc-${i + 1}`,
                },
                index: i as CharacterPlaceIndex,
            },
        ],
    })
}

async function fillUnselectedSlots(charactersData: OwnedCharacterStats[]) {
    const additions = range(3)
        .filter(i => charactersData[i] == null)
        .map(i => ({
            character: defaultOwnedCharacters[i],
            index: i as CharacterPlaceIndex,
        }))
    await callApi('placeSelectedCharacters', { characters: additions })
}

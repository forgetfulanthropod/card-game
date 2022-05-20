import { OldFilmFilter } from 'pixi-filters'
import type { CharacterPlaceIndex, OwnedCharacterStats } from 'shared'

import { MainCharacterAnimation } from './Character'
import { callApi } from '@/actions'
import { getEntryScene } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
} from '@/elementsUtil'
import { brightBackLightIsShining } from '@/util'
import { onUpdate } from '@/util/onUpdate'

const defaultOwnedCharacters: OwnedCharacterStats[] = [
    {
        name: 'skeletonWarrior',
        displayName: 'Skeleton Warrior',
        isPc: true,
        maxHealth: 10,
        damage: 2,
        constitution: 10,
        strength: 2,
        magic: 5,
        dexterity: 5,
        moves: [
            { name: 'Sword Whack', types: ['BA'] },
            { name: 'Rusty Poke', types: ['DOT2'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] },
        ],
        modifier: 1,
        level: 1,
        uid: 'pc-1',
        tokenId: '4',
        nftName: 'skeletonWarrior-4',
    },
    {
        name: 'frogKnight',
        displayName: 'Frog Knight',
        isPc: true,
        maxHealth: 72,
        damage: 8,
        constitution: 72,
        strength: 8,
        magic: 5,
        dexterity: 5,
        moves: [
            { name: 'Dutiful Stab', types: ['BA'] },
            { name: 'Sword Slash', types: ['SL'] },
        ],
        learnableMoves: [
            { minLevel: 2, name: 'Parry', types: ['DBF2'] },
            { minLevel: 2, name: 'Shield', types: ['BLK'] },
        ],
        modifier: 1,
        level: 1,
        uid: 'pc-2',
        tokenId: '4',
        nftName: 'frogKnight-4',
    },
    {
        name: 'mushroomFarmer',
        displayName: 'Mushroom Farmer',
        isPc: true,
        maxHealth: 112,
        damage: 8,
        constitution: 112,
        strength: 8,
        magic: 9,
        dexterity: 6,
        moves: [
            { name: 'Whomp', types: ['ROD1'] },
            {
                name: 'Cloud of Spores',
                types: ['DOT1', 'ROD3'],
            },
            { name: 'Bash', types: ['BA'] },
        ],
        learnableMoves: [
            {
                minLevel: 2,
                name: 'Tighten Fibers',
                types: ['BLK'],
            },
        ],
        modifier: 2,
        level: 1,
        uid: 'pc-3',
        tokenId: '4',
        nftName: 'mushroomFarmer-4',
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
        x: (BASE_WIDTH * 1037) / 1920,
        y: (BASE_HEIGHT * 698) / 1080,
        children: [],
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

        const characters =
            charactersData
                .filter(c => c != null)
                .map((c, i) => {
                    const animation = MainCharacterAnimation(c, () => {
                        const nextIndex =
                            (defaultOwnedCharacters.findIndex(
                                oc => oc.name === c.name
                            ) +
                                1) %
                            3
                        const nextChoice = defaultOwnedCharacters[nextIndex]
                        console.log({ nextIndex, nextChoice })
                        void callApi('AddSelected', {
                            character: {
                                ...nextChoice,
                                uid: `pc-${i + 1}`,
                            },
                            index: i as CharacterPlaceIndex,
                        })
                    })

                    if (animation != null) {
                        animation.x -= animation.width / 2
                        animation.y += animation.height / 2

                        animation.cursor = 'pointer'
                    }

                    return Container({
                        x: i === 0 ? -200 : i === 2 ? 0 : 200,
                        y: i === 2 ? 43 : 0,
                        scale: i === 2 ? 1.1 : 1,
                        children: [
                            animation ??
                                Sprite({
                                    anchor: [0.5, 0.5],
                                    src: getTexture(c.name),
                                    scale: 1,
                                }),
                        ],
                    })
                }) ?? []

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
    }
}

function fillUnselectedSlots(charactersData: OwnedCharacterStats[]) {
    if (charactersData.length === 0) {
        for (let index = charactersData.length; index <= 2; index++) {
            void callApi('AddSelected', {
                character: defaultOwnedCharacters[index],
                index: index as CharacterPlaceIndex,
            })
        }
    }
}

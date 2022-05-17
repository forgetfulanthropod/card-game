import type { CharacterPlaceIndex, OwnedCharacterStats } from '@/../shared'
import { addSelected } from '@/actions'
import { getEntryScene } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
} from '@/elementsUtil'
import { onUpdate } from '@/util/onUpdate'

import { MainCharacterAnimation } from './Character'

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

// const preselectFilter = new OldFilmFilter({
//     sepia: 0.02,
//     noise: 0,
//     noiseSize: 1,
//     scratch: 0.5,
//     scratchDensity: 0.3,
//     scratchWidth: 1,
//     vignetting: 0.682,
//     vignettingAlpha: 0.669,
//     vignettingBlur: 0.3,
// })

export function SelectedCharacters(): PixiContainer {
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    // selectedCharacters.on('update', )

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

    setSelectedCharacters()

    return root

    function setSelectedCharacters() {
        const charactersData = [...selectedCharacters.get()]

        void fillUnselectedSlots(charactersData)

        const characters =
            charactersData.map((c, i) => {
                const animation = MainCharacterAnimation(c)

                if (animation != null) {
                    animation.x -= animation.width / 2
                    animation.y += animation.height / 2
                    // animation.filters = [preselectFilter]
                    animation.filters = []
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

        root.removeChildren()
        if (Array.isArray(characters) && characters.length > 0)
            // @ts-ignore
            root.addChild(...characters)
    }
}

function fillUnselectedSlots(charactersData: OwnedCharacterStats[]) {
    if (charactersData.length === 0) {
        const fillerData: OwnedCharacterStats[] = [
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
                uid: 'skeletonWarrior-4',
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
                uid: 'frogKnight-4',
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
                uid: 'mushroomFarmer-4',
                tokenId: '4',
                nftName: 'mushroomFarmer-4',
            },
        ]
        for (let index = charactersData.length; index <= 2; index++) {
            void addSelected({
                character: fillerData[index],
                index: index as CharacterPlaceIndex,
            })
        }
    }
}

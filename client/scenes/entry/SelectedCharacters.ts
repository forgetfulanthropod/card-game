import { MainCharacterAnimation } from '@sharedElements'
import { Tweener, Easing } from 'pixi-tweener'
import { keys } from 'shared/code'
import type { CharacterPlaceIndex, SelectedCharacters } from 'shared'

import {
    composeDefaultParty,
    selectedCharacterId,
    selectedCharacterPlaceIndex,
} from './CharacterOptions'
import { getEntryScene } from '@/data'
import type { AssetKey, DisplayObject, PixiContainer } from '@/elementsUtil'
import {
    glowFilter,
    isTextureKey,
    PixiTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
    Text,
    fontMap,
} from '@/elementsUtil'
import { hoveredCharacterUid, onUpdate } from '@/util'

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

// const darkenFilter = new OldFilmFilter({
//     sepia: 0,
//     noise: 0,
//     noiseSize: 1,
//     scratch: 0.5,
//     scratchDensity: 0.3,
//     scratchWidth: 1,
//     vignetting: 0.8,
//     vignettingAlpha: 0.669,
//     vignettingBlur: 0.3,
// })

export function SelectedCharactersEl(): PixiContainer {
    console.log('selected characters...')
    const selectedCharacters = getEntryScene().select('selectedCharacters')

    const numSelected = selectedCharacters
        .get()
        .reduce(
            (accumulator, character) =>
                accumulator + (character != null ? 1 : 0),
            0
        )
    if (numSelected === 0) composeDefaultParty()

    const root = Container({
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
        const charactersData = selectedCharacters.get()

        // void fillUnselectedSlots(charactersData)

        const characters = Characters(charactersData)
        listenerStack.pop()?.()

        root.removeChildren()

        const pedestalRays = PedestalRays(characters)

        if (pedestalRays.length) root.addChild(...pedestalRays)
        if (pedestalRays.length === 3) root.addChild(SelectedCharacterText())
        const validCharacters = characters.filter(
            c => c != null
        ) as PixiContainer[]
        if (validCharacters.length) root.addChild(...validCharacters)
        root.sortChildren()
    }
}

function SelectedCharacterText() {
    return Text({
        // text: 'CHOOSE YOUR CHARACTERS',
        text: 'CHOOSE   YOUR   KAIJU',
        x: BASE_WIDTH * 0.506,
        y: BASE_HEIGHT * 0.565,
        anchor: 0.5,
        style: {
            fontFamily: fontMap['bigFont'],
            fontSize: 50,
            fill: 0xdddddd,
            strokeThickness: 22,
            stroke: 2236962,
        },
    })
}

function Characters(charactersData: SelectedCharacters) {
    return charactersData
        .map((c, i) => {
            const characterHeight = 260

            if (c == null) return null

            const props = {
                ...getXYAtIndex(i),
                // scale: i === 1 ? 1.1 : 1,
            } as const
            return Container(
                {
                    ...props,
                },

                MainCharacterAnimation({
                    characterMeta: c,
                    events: {
                        pointerenter() {},
                        pointerleave() {
                            // only un-hover on bg click...
                        },
                        pointerup() {
                            hoveredCharacterUid.set(c.uid)
                            selectedCharacterPlaceIndex.set(
                                i as CharacterPlaceIndex
                            )
                            selectedCharacterId.set(c.id)
                        },
                    },
                    _height: characterHeight,
                }) ??
                    Sprite({
                        anchor: 0.5,
                        src: isTextureKey(c.id)
                            ? getTexture(c.id)
                            : PixiTexture.WHITE,
                        scale: 1,
                    })
            )
        })
        .filter(el => el != null)
        .sort((elA, elB) => {
            return elA!.y - elB!.y || elA!.x - elB!.x
        })
}

function PedestalRays(characters: (PixiContainer | null)[]) {
    const rays = characters.map((c, index): PixiContainer | null => {
        if (c != null) return null

        const src = getTexture(`pedestalRay${index}` as AssetKey)

        return Container(
            {
                zIndex: index,
            },
            Sprite({
                name: `pedestalRay${index}`,
                src,
                scale: BASE_WIDTH / src.width,
            }),
            Container(
                {},
                LoopingAnimation(
                    Sprite({
                        name: `select${index}`,
                        src: 'selectCharacterArrow',
                        anchor: [0.5, 1.4],
                        ...getXYAtIndex(index),
                    }),
                    {
                        y: getXYAtIndex(index).y - 33,
                    }
                ),
                Sprite({
                    name: `click region`,
                    src: PixiTexture.WHITE,
                    width: 190 + (index === 2 ? 50 : 0),
                    height: 360 + (index === 2 ? 50 : 0),
                    alpha: 0,
                    events: {
                        pointerup() {
                            selectedCharacterPlaceIndex.set(
                                index as CharacterPlaceIndex
                            )
                            selectedCharacterId.set(null)
                            hoveredCharacterUid.set(null)
                        },
                    },
                    anchor: [0.5, 0.92],
                    ...getXYAtIndex(index),
                })
            )
        )
    })

    selectedCharacterPlaceIndex.onChange(() => {
        rays.forEach((ray, rayIndex) => {
            if (ray == null) return

            ray.children[1].filters =
                selectedCharacterPlaceIndex.val === rayIndex ? [glowFilter] : []
        })
    })

    return rays.filter(c => c != null) as PixiContainer[]
}

function getXYAtIndex(i: number) {
    const x = 0.5 * BASE_WIDTH
    const y = 0.818 * BASE_HEIGHT
    return {
        x: x + (i === 2 ? -240 : i === 1 ? 0 : 240),
        y: y + (i === 1 ? 33 : 0),
    }
}

interface TweenProps {
    [key: string]: number
}

function LoopingAnimation(el: DisplayObject, params: TweenProps) {
    const originalProps = {}
    keys(params).forEach(pKey => {
        //@ts-expect-error
        originalProps[pKey] = el[pKey]
    })

    el.on('destroyed', () => {
        Tweener.killTweensOf(el)
    })
    ;(function play() {
        if (el == null) return

        void Tweener.add(
            {
                //@ts-expect-error
                target: el,
                ease: Easing.easeInOutSine,
                duration: 1,
            },
            {
                ...params,
            }
        ).then(() => {
            void Tweener.add(
                {
                    target: el,
                    ease: Easing.easeInOutSine,
                    duration: 1,
                },
                {
                    ...originalProps,
                }
            ).then(play)
        })
    })()

    return el
}

import { MainCharacterAnimation } from '@sharedElements'
import { Tweener, Easing } from 'pixi-tweener'
import { keys } from 'shared/code'
import type { CharacterPlaceIndex } from 'shared'
import { compose } from 'datums'
import {
    selectedCharacterId,
    selectedCharacterPlaceIndex,
} from './CharacterOptions'
import { getEntryScene } from '@/data'
import type { DisplayObject, PixiContainer } from '@/elementsUtil'
import {
    glowFilter,
    If,
    isTextureKey,
    PixiTexture,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
    Text,
} from '@/elementsUtil'
import { onUpdate } from '@/util'

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
    const selectedCharacters = getEntryScene().select('selectedCharacters')

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

        const characterHeight = 260
        const characters =
            charactersData
                .map((c, i) => {
                    if (c == null) return null
                    const props = {
                        ...getXYAtIndex(i),
                        scale: i === 2 ? 1.1 : 1,
                    } as const
                    return [
                        Container(
                            {
                                zIndex: i,
                                ...props,
                            },

                            MainCharacterAnimation({
                                characterMeta: c,
                                events: {
                                    pointerout() {
                                        // only un-hover on bg click...
                                    },
                                    pointerup() {
                                        selectedCharacterPlaceIndex.set(
                                            i as CharacterPlaceIndex
                                        )
                                        selectedCharacterId.set(c.id)
                                    },
                                },
                                height: characterHeight,
                            }) ??
                                Sprite({
                                    anchor: 0.5,
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

        root.removeChildren()

        // range(3 - characters.length).map((i) => {
        //     root.addChild(Sprite({
        //         src: ''
        //     }))
        // })

        const pedestalRays = characters
            .map((c, index): PixiContainer | null => {
                if (c != null) return null

                return If(
                    compose(
                        selectedIndex => selectedIndex ?? true,
                        selectedCharacterPlaceIndex
                    ),
                    ([selectedIndex]) =>
                        Container(
                            {
                                zIndex: index,
                            },
                            Sprite({
                                name: `pedestalRay${index}`,
                                src: `pedestalRay${index}`,
                                scale:
                                    BASE_WIDTH /
                                    getTexture(`pedestalRay${index}`).width,
                            }),
                            Container(
                                {},
                                LoopingAnimation(
                                    Sprite({
                                        name: `select${index}`,
                                        src: 'selectCharacterArrow',
                                        anchor: [0.5, 1.4],
                                        ...getXYAtIndex(index),
                                        filters:
                                            selectedIndex === index
                                                ? [glowFilter]
                                                : [],
                                    }),
                                    {
                                        ...getXYAtIndex(index),
                                        y: getXYAtIndex(index).y - 33,
                                    }
                                    // [
                                    //     {
                                    //         duration: 2,
                                    //         ease: Easing.easeInExpo,
                                    //     },
                                    // ]
                                    // {
                                    //     from: {
                                    //         ...getXYAtIndex(index),
                                    //     },
                                    //     to: {
                                    //         ...getXYAtIndex(index),
                                    //         y: getXYAtIndex(index) - 33,
                                    //     },
                                    // }
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
                                        },
                                    },
                                    anchor: [0.5, 0.92],
                                    ...getXYAtIndex(index),
                                })
                            )
                        )
                )
            })
            .filter(c => c != null) as PixiContainer[]

        if (pedestalRays.length) root.addChild(...pedestalRays)
        if (pedestalRays.length === 3)
            root.addChild(
                Text({
                    text: 'SELECT A CHARACTER',
                    x: BASE_WIDTH * 0.506,
                    y: BASE_HEIGHT * 0.565,
                    anchor: 0.5,
                    style: {
                        fontFamily: 'bigFont',
                        fontSize: 50,
                        fill: 0xdddddd,
                        strokeThickness: 22,
                        stroke: 0x222_222,
                    },
                })
            )
        const validCharacters = characters.filter(
            c => c != null
        ) as PixiContainer[]
        if (validCharacters.length) root.addChild(...validCharacters)
        root.sortChildren()

        // listenerStack.push(
        //     brightBackLightIsShining.onChange((is, _, unsub) => {
        //         if (is) unsub()

        //         characters.forEach(c => (c.filters = is ? [darkenFilter] : []))
        //     })
        // )
    }
}

function getXYAtIndex(i: number) {
    const x = 0.507 * BASE_WIDTH
    const y = 0.807 * BASE_HEIGHT
    return {
        x: x + (i === 0 ? -190 : i === 2 ? 0 : 170),
        y: y + (i === 2 ? 43 : 0),
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

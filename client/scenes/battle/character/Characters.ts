import { uniq } from 'lodash'
import { compose, datum } from 'datums'
import type { Characters, CharacterUid } from 'shared'
import { keys, sleep } from 'shared/code'
import type { DisplayObject } from 'pixi.js'
import { ColorOverlayFilter } from 'pixi-filters'
import { Tweener } from 'pixi-tweener'
import { Character } from './Character'
import type { PixiContainer } from '@/elementsUtil'
import { For } from '@/elementsUtil'
import { localTree } from '@/data'
import { statChangesDatum, toDatum } from '@/util'

export function Characters(scene: ROBattleScene): PixiContainer {
    const allCharsC = scene.select('allCharacters')
    const justDiedDatum = datum<CharacterUid[]>([])

    const root = For(
        //@ts-expect-error
        compose(
            // ([allCharacters, justDied]) => {
            //     return []
            // },
            ([allCharacters, justDied], lastOut) => {
                const living = keys(allCharacters).filter(
                    cK => allCharacters[cK].health > 0
                )

                if (!Array.isArray(lastOut)) {
                    return living
                }

                if (living.length < lastOut.length) {
                    const removedIndices = lastOut
                        .map((_, i) => i)
                        .filter(i => !living.includes(lastOut[i]))

                    console.log('animating out', {
                        living,
                        lastOut,
                        removedIndices,
                        children: root.children,
                    })

                    animateOut(
                        root.children,
                        removedIndices,
                        removedIndices.map(i => lastOut[i])
                    )
                    return lastOut
                }

                return living
            },
            toDatum<Characters>(allCharsC, c => c),
            justDiedDatum
        ),
        (uid: CharacterUid) =>
            Character({
                cursor: allCharsC.select(uid),
                onClick: () => {
                    localTree
                        .select('selectedTargets')
                        .apply(arr => uniq([...arr, uid]))
                },
                scale: 1,
            })
        // uid =>
        //     If(
        //         toDatum(scene.select('allCharacters', uid), c => c.health > 0),
        //         () =>
        //     ),
        // undefined,
        // { name: 'CharactersContainer' }
    )

    return root
}

function animateOut(
    els: DisplayObject[],
    indices: number[],
    uids: CharacterUid[]
) {
    indices.forEach((elIndex, i) => {
        animateOutOne(els[elIndex], uids[i])
    })
}

function animateOutOne(el: DisplayObject, uid: CharacterUid) {
    statChangesDatum.onChange((statChanges, _, unsub) => {
        console.log({ statChanges })
        if (!statChanges[uid]?.health) return

        animateDeath(el)

        unsub()
    })
}

let colorOverlayFilter: ColorOverlayFilter | null = null

function animateDeath(el: DisplayObject) {
    // el.filters = getAnimatedDeathFilters()
    void Tweener.add(
        {
            target: el,
            duration: 0.3,
        },
        {
            alpha: 0,
        }
    )
        .then(async () => {
            el.alpha = 0.2
            await sleep(33)
        })
        .then(async () => {
            el.alpha = 0
            await sleep(33)
        })
        .then(async () => {
            el.alpha = 0.2
            await sleep(33)
        })
        .then(async () => {
            el.alpha = 0
            await sleep(33)
        })
        .then(async () => {
            el.filters = [getColorReplaceFilter()]
            await sleep(33)
        })
        .then(async () => {
            el.alpha = 0
            await sleep(33)
        })
        .then(async () => {
            el.filters = [getColorReplaceFilter()]
            await sleep(33)
            await sleep(33)
        })
        .then(() => {
            el.alpha = 0
        })
}

function getColorReplaceFilter() {
    if (colorOverlayFilter == null)
        colorOverlayFilter = new ColorOverlayFilter(0xffffff)

    return colorOverlayFilter
}

// function getAnimatedDeathFilters(): Filter[] | null {
//     return [getColorReplaceFilter(), getAlphaFilter()]
// }

// const AlphaFilter = filters.AlphaFilter
// let alphaFilter: Filter | null = null

// function getAlphaFilter() {
//     if (alphaFilter == null) alphaFilter = new AlphaFilter(0.3)

//     alphaFilter.state.data = 1

//     return alphaFilter
// }

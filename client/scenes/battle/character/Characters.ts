import { uniq } from 'lodash'
import { compose } from 'datums'
import type { Characters, CharacterUid } from 'shared'
import { keys, sleep } from 'shared/code'
import type { DisplayObject } from 'pixi.js'
import { ColorOverlayFilter } from 'pixi-filters'
import { Tweener } from 'pixi-tweener'
import { Character } from './Character'
import type { PixiContainer } from '@/elementsUtil'
import { For } from '@/elementsUtil'
import { localTree } from '@/data'
import { waitForDeathAnimationDatum, statChangesDatum, toDatum } from '@/util'

export function Characters(scene: ROBattleScene): PixiContainer {
    const allCharsC = scene.select('allCharacters')

    const root = For(
        //@ts-expect-error
        compose(
            ([allCharacters, waitForDeathAnimation], lastOut) => {
                const living: CharacterUid[] = keys(allCharacters).filter(
                    cK => allCharacters[cK].health > 0
                )

                if (!Array.isArray(lastOut)) return living

                if (waitForDeathAnimation === true) return lastOut

                if (
                    living.length < lastOut.length &&
                    waitForDeathAnimation === null
                ) {
                    manageNewDeaths(lastOut, living)

                    return lastOut
                }

                // if (living.length < lastOut.length &&

                setTimeout(() => waitForDeathAnimationDatum.set(null), 0)

                return living
            },
            toDatum<Characters>(allCharsC, c => c),
            waitForDeathAnimationDatum
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
    )

    return root

    function manageNewDeaths(lastOut: CharacterUid[], living: CharacterUid[]) {
        waitForDeathAnimationDatum.set(true)

        const removedIndices = lastOut
            .map((_, i) => i)
            .filter(i => !living.includes(lastOut[i]))

        console.log('playing death animation')

        const newJustDied = removedIndices.map(i => lastOut[i])

        void animateOut(root.children, removedIndices, newJustDied).then(() =>
            waitForDeathAnimationDatum.set(false)
        )
    }
}

async function animateOut(
    els: DisplayObject[],
    indices: number[],
    uids: CharacterUid[]
) {
    return await Promise.all(
        indices.map((elIndex, i) => animateOutOne(els[elIndex], uids[i]))
    )
}

async function animateOutOne(el: DisplayObject, uid: CharacterUid) {
    return new Promise<void>(resolve => {
        statChangesDatum.onChange(async (statChanges, _, unsub) => {
            console.log({ statChanges })
            if (!statChanges[uid]?.health) return

            await animateDeath(el)

            resolve()

            unsub()
        })
    })
}

let colorOverlayFilter: ColorOverlayFilter | null = null

async function animateDeath(el: DisplayObject) {
    await Tweener.add(
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

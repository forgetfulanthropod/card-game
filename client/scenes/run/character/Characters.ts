import { localTree } from '@/data'
import type { PixiContainer, SpineAsset } from '@/elementsUtil'
import { For } from '@/elementsUtil'
import { statChangesDatum, toDatum, waitForDeathAnimationsDatum } from '@/util'
import { Spine } from '@pixi-spine/all-4.1'
import { compose } from 'datums'
import { omit } from 'lodash'
import { ColorOverlayFilter } from 'pixi-filters'
import { Tweener } from 'pixi-tweener'
import type { DisplayObject } from 'pixi.js'
import { Characters, CharacterUid } from 'shared'
import { keys, sleep } from 'shared/code'
import { Character } from './Character'

export function Characters(scene: ROBattleScene): PixiContainer {
    const allCharsC = scene.select('allCharacters')

    const uidsDatum = compose(
        ([allCharacters, waitForDeathAnimations], lastOut) => {
            const living: CharacterUid[] = keys(allCharacters).filter(
                cK => allCharacters[cK].health > 0
            )

            if (!Array.isArray(lastOut)) return living

            const currentlyDyingUids = keys(waitForDeathAnimations).filter(
                uid => waitForDeathAnimations[uid]
            )
            const areAllDeathAnimationsPlaying =
                currentlyDyingUids.length > 0 &&
                currentlyDyingUids.length === lastOut.length - living.length

            if (areAllDeathAnimationsPlaying) return lastOut

            if (
                lastOut.length - living.length >
                    keys(waitForDeathAnimations).length &&
                root.children.length
            ) {
                manageNewDeaths(lastOut, living)

                return lastOut
            }

            const deadUids: CharacterUid[] = keys(
                waitForDeathAnimations
            ).filter(uid => waitForDeathAnimations[uid] === false)

            if (deadUids.length) {
                return clearDeadFromLastOut(deadUids, lastOut)
            }

            return living
        },
        toDatum<Characters>(allCharsC, c => c),
        waitForDeathAnimationsDatum
    )

    const root = For(
        //@ts-expect-error
        uidsDatum,
        (uid: CharacterUid) =>
            Character({
                cursor: allCharsC.select(uid),
                onClick: () => {
                    localTree
                        .select('selectedTargets')
                        .apply(arr => [...arr, uid])
                },
                scale: 1,
            })
    )

    return root

    function clearDeadFromLastOut(
        deadUids: CharacterUid[],
        lastOut: CharacterUid[]
    ) {
        const remainingWaitForDeathAnims = omit(
            waitForDeathAnimationsDatum.val,
            deadUids
        )

        setTimeout(
            () => waitForDeathAnimationsDatum.set(remainingWaitForDeathAnims),
            0
        )

        // console.log('clearing the dead')

        return lastOut.filter(uid => !deadUids.includes(uid))
    }

    function manageNewDeaths(lastOut: CharacterUid[], living: CharacterUid[]) {
        const removedIndices = lastOut
            .map((_, i) => i)
            .filter(
                i =>
                    !living.includes(lastOut[i]) &&
                    waitForDeathAnimationsDatum.val[lastOut[i]] == null
            )
        const removedCharacterUids = removedIndices.map(i => lastOut[i])

        const waiting: Record<CharacterUid, boolean> = {
            ...waitForDeathAnimationsDatum.val,
        }

        removedCharacterUids.map(i => {
            waiting[i] = true
        })

        waitForDeathAnimationsDatum.set(waiting)

        // console.log('animating out ', removedCharacterUids)
        void animateOut(
            root.children as PixiContainer[],
            removedIndices,
            removedCharacterUids
        ).then(() => {
            // console.log('animated out ', removedCharacterUids)
            const waiting: Record<CharacterUid, boolean> = {
                ...waitForDeathAnimationsDatum.val,
            }

            removedCharacterUids.forEach(uid => (waiting[uid] = false))

            // console.log('updating to ', waiting)

            waitForDeathAnimationsDatum.set(waiting)
        })
    }
}

async function animateOut(
    els: PixiContainer[],
    indices: number[],
    uids: CharacterUid[]
) {
    // indices.map((elIndex, i) =>
    //     console.log({ elIndex, els, el: els[elIndex], i, uid: uids[i] })
    // )

    return await Promise.all(
        indices.map((elIndex, i) => animateOutOne(els[elIndex], uids[i]))
    )
}

async function animateOutOne(el: PixiContainer, uid: CharacterUid) {
    // console.log('animateOutOneHere', { el, uid })
    return new Promise<void>(resolve => {
        statChangesDatum.onChange(async (statChanges, _, unsub) => {
            // console.log(
            //     { myStatChanges: JSON.stringify(statChanges[uid]), uid },
            //     'not ready to trigger death animation??',
            //     !statChanges[uid]?.health || statChanges[uid]?.wait,
            //     '!statChanges[uid]?.health || statChanges[uid]?.wait'
            // )
            if (!statChanges[uid]?.health || statChanges[uid]?.wait) return

            // console.log('the changes are causing an animation for ', uid)
            await animateDeath(el)

            unsub()
            resolve()
        }, true)
    })
}

let colorOverlayFilter: ColorOverlayFilter | null = null

async function animateDeath(el: PixiContainer) {
    // console.log('got to animateDeath even...')
    await sleep(200)
    const filter = getColorOverlayFilter()
    el.filters = [filter]

    return await toFilterAlpha(0, 0.3)
        .then(async () => await toFilterAlpha(0.2, 0.033))
        .then(async () => await toFilterAlpha(0, 0.033))
        .then(async () => await toFilterAlpha(0.4, 0.033))
        .then(async () => await toFilterAlpha(0, 0.033))
        .then(async () => await toFilterAlpha(0.6, 0.033))
        .then(async () => await toFilterAlpha(0, 0.033))
        .then(async () => {
            await toFilterAlpha(1, 0.033)

            const anim = (el.children?.[0] as unknown as PixiContainer)
                ?.children?.[0] as unknown as Spine
            //freezes animation
            anim?.state && (anim.state.timeScale = 0)
            await Tweener.add(
                {
                    target: el,
                    duration: 0.3,
                },
                {
                    alpha: 0,
                }
            )
        })

    async function toFilterAlpha(alpha: number, duration: number) {
        return await Tweener.add(
            {
                target: filter,
                duration,
            },
            {
                alpha,
            }
        )
    }
}

function getColorOverlayFilter() {
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

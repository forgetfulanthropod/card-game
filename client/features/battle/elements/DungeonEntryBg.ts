import { getTree } from '@/data/rootTree'
import type { PlayablePixiSprite } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import {
    bgLoopEnded,
    brightBackLightIsShining,
    waitingForSceneExitAnimationToFinish,
} from '@/util'

import bgOnTransitionSrc from '../assets/backgrounds/Kaiju_Character_select_barf.mp4'
import bgSrc from '../assets/backgrounds/Kaiju_Character_select_loop.mp4'
import Background from './background'

const TIME_FOR_OUTRO_BRIGHTNESS_MS = 400
const TIME_FOR_OUTRO_MS = 2500
export function DungeonEntryBg() {
    const bgOnTransition = Background({
        scale: 1,
        src: bgOnTransitionSrc,
    }) as PlayablePixiSprite

    bgLoopEnded.onChange(() => console.log('bg loop cycle event  hi'))
    // localBus.bgLoopEnded.on(() => console.log('bg loop cycle event  hi'))
    const sceneTypeCursor = getTree().select('scene', 'name')

    sceneTypeCursor.once('update', () => {
        waitingForSceneExitAnimationToFinish.set(true)

        if (sceneTypeCursor.get() !== 'battle')
            console.error('WE CAN ONLY GO TO BATTLE :CRY:')

        bgLoopEnded.onChange((_, __, unsub) => {
            unsub()

            root.children.forEach(c => c.destroy())
            root.removeChildren()

            const unsubFinished = bgLoopEnded.onChange(() => {
                unsubFinished()
            })

            bgOnTransition.play()
            setTimeout(() => {
                brightBackLightIsShining.set(true)
            }, TIME_FOR_OUTRO_BRIGHTNESS_MS)
            setTimeout(() => {
                waitingForSceneExitAnimationToFinish.set(false)
            }, TIME_FOR_OUTRO_MS)

            root.addChild(bgOnTransition)
        })
    })

    const root = Container({ children: [Background({ scale: 1, src: bgSrc })] })
    return root
}

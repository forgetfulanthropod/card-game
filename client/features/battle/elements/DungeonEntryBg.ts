import { datum } from 'datums'

import { getTree } from '@/data/rootTree'
import type { PlayablePixiSprite } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import {
    brightBackLightIsShining,
    waitingForSceneExitAnimationToFinish,
} from '@/util'

import bgOnTransitionSrc from '../assets/backgrounds/Kaiju_Character_select_barf.mp4'
import bgSrc from '../assets/backgrounds/Kaiju_Character_select_loop.mp4'
import Background from './background'

const TIME_FOR_OUTRO_BRIGHTNESS_MS = 400
const TIME_FOR_OUTRO_MS = 2500
export function DungeonEntryBg() {
    const bgLoopEnded = datum<number>(0)

    const bgOnTransition = Background({
        scale: 1,
        src: bgOnTransitionSrc,
        bgLoopEnded,
    }) as PlayablePixiSprite

    const sceneTypeCursor = getTree().select('scene', 'name')

    sceneTypeCursor.once('update', () => {
        waitingForSceneExitAnimationToFinish.set(true)

        if (sceneTypeCursor.get() !== 'battle')
            console.error('WE CAN ONLY GO TO BATTLE :CRY:')

        bgLoopEnded.onChange((_, __, unsub) => {
            unsub()

            bgOnTransition.play()
            brightBackLightIsShining.set(false)
            setTimeout(() => {
                brightBackLightIsShining.set(true)
            }, TIME_FOR_OUTRO_BRIGHTNESS_MS)
            setTimeout(() => {
                waitingForSceneExitAnimationToFinish.set(false)
            }, TIME_FOR_OUTRO_MS)

            root.addChild(bgOnTransition)
            // setTimeout(() => root.removeChildAt(0).destroy(), 0)
        })
    })

    const root = Container({
        children: [Background({ scale: 1, src: bgSrc, bgLoopEnded })],
    })
    return root
}

import type { PlayablePixiSprite } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { localBus } from '@/util'

import bgOnTransitionSrc from '../assets/backgrounds/Kaiju_Character_select_barf.mp4'
import bgSrc from '../assets/backgrounds/Kaiju_Character_select_loop.mp4'
import Background from './background'

export function DungeonEntryBg() {
    const bgOnTransition = Background({
        scale: 1,
        src: bgOnTransitionSrc,
    }) as PlayablePixiSprite

    localBus.bgLoopEnded.on(() => console.log('bg loop cycle event  hi'))

    localBus.sceneChange.on(async sceneType => {
        if (sceneType !== 'battle')
            console.error('WE CAN ONLY GO TO BATTLE :CRY:')

        const unsubCycleFinish = localBus.bgLoopEnded.on(() => {
            unsubCycleFinish()

            root.children.forEach(c => c.destroy())
            root.removeChildren()

            const unsubFinished = localBus.bgLoopEnded.on(() => {
                unsubFinished()

                resolve()
            })

            bgOnTransition.play()

            root.addChild(bgOnTransition)
        })

        let resolve: () => void
        return new Promise(r => (resolve = r))
    })

    const root = Container({ children: [Background({ scale: 1, src: bgSrc })] })
    return root
}

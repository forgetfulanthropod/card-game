import { datum } from 'datums'
import { getTree } from '@/data'
import type { PlayablePixiSprite } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { Background } from '@/scenes'
import { animation$, brightBackLightIsShining } from '@/util'
const bgOnTransitionFullSrc =
    'assets/backgrounds/Kaiju_Character_select_barf.mp4'
const bgFullSrc = 'assets/backgrounds/Kaiju_Character_select_loop.mp4'

const TIME_FOR_OUTRO_BRIGHTNESS_MS = 400
const TIME_FOR_OUTRO_MS = 2500
export function DungeonEntryBg() {
    const bgLoopEnded = datum<number>(0)

    const bgOnTransition = Background({
        scale: 1,
        src: bgOnTransitionFullSrc,
        bgLoopEnded,
    }) as PlayablePixiSprite

    const sceneTypeCursor = getTree().select('scene', 'id')

    sceneTypeCursor.once('update', () => {
        if (sceneTypeCursor.get() !== 'battle')
            console.error('WE CAN ONLY GO TO BATTLE :CRY:')

        bgLoopEnded.onChange((_, __, unsub) => {
            unsub()

            bgOnTransition.play()
            brightBackLightIsShining.set(false)
            setTimeout(
                () => brightBackLightIsShining.set(true),
                TIME_FOR_OUTRO_BRIGHTNESS_MS
            )
            setTimeout(
                () => void animation$.send('scene exit done'),
                TIME_FOR_OUTRO_MS
            )

            root.addChild(bgOnTransition)
            // setTimeout(() => root.removeChildAt(0).destroy(), 0)
        })
    })

    const root = Container(
        {},
        Background({ scale: 1, src: bgFullSrc, bgLoopEnded })
    )
    return root
}

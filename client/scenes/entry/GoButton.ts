import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { callServerApi } from '@/callServerApi'
import { getTree } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import {
    glowFilter,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    Sprite,
} from '@/elementsUtil'

export function GoButton(): PixiContainer {
    const startRun = async () => {
        root.visible = false
        const userId = getTree().get('username')
        const { runId } = await callServerApi('startRun', {
            userId,
        })
        await callApi('changeScene', { newSceneName: 'battle' })
        await callApi('setRunId', { userId, runId })
        collectData('run_start', {
            map_seed: 1,
            run_id: runId,
        })
    }

    const bg = Sprite({
        src: getTexture('goButton'),
        anchor: 0.5,
        scale: (1920 * 0.18) / getTexture('goButton').width,
        async onClick() {
            startRun()
        },
        events: {
            pointerover() {
                bg.filters = [glowFilter]
            },
            pointerout() {
                bg.filters = null
            },
        },
    })

    bg.cursor = `url('assets/root/hand.webp'), pointer`

    const root = Container(
        {
            x: BASE_WIDTH * 0.85,
            y: BASE_HEIGHT * 0.88,
        },
        bg
    )

    return root
}

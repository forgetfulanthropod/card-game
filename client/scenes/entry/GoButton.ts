import { callApi } from '@/callApi'
import { callServerApi } from '@/callServerApi'
import { getBattleScene } from '@/data'
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
        await callApi('changeScene', { newSceneName: 'battle' })
        const scene = getBattleScene()
        const userId = scene.get('username')
        const { runId } = await callServerApi('startRun', {
            userId,
        })
        await callApi('setRunId', { userId, runId })
        gtag('event', 'ui_ux_view', { page_title: 'Battle' })
        gtag('event', 'run_start', {
            map_seed: 1,
            run_id: runId,
            try_again: 'false',
        })

        // TODO move below to hex map level entry on click
        // gtag('event', 'level_start', {
        //     room_number: scene.get('numRoomsPassed') + 1,
        //     room_id: 1,
        //     room_tier: 1,
        //     run_id: 1,
        // }) //TODO fill out with real values
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

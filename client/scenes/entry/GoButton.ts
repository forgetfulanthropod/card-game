import { collectData } from '@/analytics/collectData'
import { callApi } from '@/callApi'
import { callServerApi } from '@/callServerApi'
import { getTree } from '@/data'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
} from '@/elementsUtil'

import { GradientButton } from '@/scenes/shared/'

export function GoButton() {
    const onClick = async () => {
        const userId = getTree().get('userId')
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
    return GradientButton({
        onClick,
        text: 'go!',
        x: BASE_WIDTH * 0.85,
        y: BASE_HEIGHT * 0.88,
        gradientFrom: 0x109f10,
        gradientTo: 0x36e736,
        fontSize: 72,
        extraWide: true
    })
}

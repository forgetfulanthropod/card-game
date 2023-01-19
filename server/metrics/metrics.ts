import type { Gamestate, BattleScene } from 'shared'
import { writeMetric } from './influx'

export const startRunMetric = (runId: number, username: string = '') => {
    let tags = {
        run_id: runId,
    }
    if (username) {
        Object.assign(tags, { user_name: username })
    }
    writeMetric('run_start', 1, tags)
}

export const endRunMetrics = (
    scene: BattleScene,
    runDuration: number,
    restart: boolean | undefined,
    username: string | undefined = ''
) => {
    const { runId, state } = scene
    let stateName = restart ? 'restart' : state
    let currentRoom = scene.currentRoom.uid
    if (currentRoom == 'root') {
        currentRoom = '0_0'
    }
    let tags = {
        state: stateName,
        current_room: currentRoom,
        run_id: runId,
        user_name: username,
    }
    if (username) {
        Object.assign(tags, { user_name: username })
    }

    const totalScore = scene.runScore.totalScore || 0
    writeMetric('run_end', 1, tags)
    writeMetric('run_score', totalScore, tags)
    writeMetric('run_duration', runDuration, tags)
}

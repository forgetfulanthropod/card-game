import type { BattleScene } from 'shared'
import { FieldType, writeMetric } from './influx'

export interface BareServerMetricsArgs {
    startRun: { runId: number; username: string }
    endRun: { runDuration: number; restart: boolean; scene: BattleScene }
}

export type ServerMetricsArgs = {
    [K in keyof BareServerMetricsArgs]: BareServerMetricsArgs[K]
}

export type ServerMetrics = {
    [K in keyof ServerMetricsArgs]: (args: ServerMetricsArgs[K]) => void
}

export const startRun: ServerMetrics['startRun'] = args => {
    const { runId, username } = args
    let tags = {
        run_id: runId,
        user_name: username,
    }
    writeMetric('run_start', tags)
}

export const endRun: ServerMetrics['endRun'] = args => {
    const { runDuration, restart, scene } = args
    let stateName = restart ? 'restart' : scene.state
    let currentRoom = scene.currentRoom.uid
    if (currentRoom == 'root') {
        currentRoom = '0_0'
    }
    let tags = {
        state: stateName,
        current_room: currentRoom,
        run_id: scene.runId,
        user_name: scene.username,
    }

    const totalScore = scene.runScore.totalScore
    // TODO: discussion: put in one measurement or keep separate?
    writeMetric('run_end', tags)
    writeMetric('run_score', tags, [
        { value: totalScore, type: FieldType.float },
    ])
    writeMetric('run_duration', tags, [{ value: runDuration }])
}

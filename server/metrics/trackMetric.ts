import * as serverMetricsActions from './metrics'
import * as gameMetricsActions from 'game/metrics'
import { GameMetricsArgs, GameMetrics } from 'game/metrics'
import { ServerMetricsArgs, ServerMetrics } from './metrics'

export type AllMetricArgs = GameMetricsArgs & ServerMetricsArgs

export const trackMetric = <K extends keyof AllMetricArgs>(
    method: K,
    args: AllMetricArgs[K]
) => {
    let action
    if (method in gameMetricsActions) {
        action = gameMetricsActions[method as keyof GameMetrics]
    } else {
        action = serverMetricsActions[method as keyof ServerMetrics]
    }

    // @ts-expect-error
    action(args)
}

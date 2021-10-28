import type { SceneName } from '@shared'

export type ChangeScene = (args: { newSceneName: SceneName }) => void

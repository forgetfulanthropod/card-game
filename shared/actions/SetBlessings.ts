/** Admin-only */

import type { BlessingName } from '@shared'

export type SetBlessings = (args: { blessings: BlessingName[] }) => void

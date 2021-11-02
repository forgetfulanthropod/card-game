/** Admin-only */

import type { Blessing } from '@shared'

export type SetBlessings = (args: { blessings: Blessing[] }) => void

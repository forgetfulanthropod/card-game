import type { GameActions } from '@serverActions'

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { setGlobalRandomSeed } from '@/config/seedrand'

export const resetRandomSeed: GameActions['ResetRandomSeed'] = () =>
    setGlobalRandomSeed()

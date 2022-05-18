import type { GameActions } from '@serverActions'

import { setGlobalRandomSeed } from '@/config/seedrand'

export const resetRandomSeed: GameActions['ResetRandomSeed'] = () =>
    setGlobalRandomSeed()

import type { ServerActions } from '@serverActions'

import { setGlobalRandomSeed } from '@/config/seedrand'

export const resetRandomSeed: ServerActions['ResetRandomSeed'] = () =>
    setGlobalRandomSeed()

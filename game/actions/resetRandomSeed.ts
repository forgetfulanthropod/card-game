import type { GameActions } from 'shared'

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { setGlobalRandomSeed } from '@/config/seedrand'

export const resetRandomSeed: GameActions['resetRandomSeed'] = () =>
    setGlobalRandomSeed('seedThree')

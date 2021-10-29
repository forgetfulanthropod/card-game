import type { ResetRandomSeed } from '@/../shared/actions/ResetRandomSeed'
import { setGlobalRandomSeed } from '@/config/seedrand'

export const resetRandomSeed: ResetRandomSeed = (_args) => setGlobalRandomSeed()

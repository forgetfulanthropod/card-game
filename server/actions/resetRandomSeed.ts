import { ResetRandomSeed } from '@/../shared/actions/ResetRandomSeed'
import { setGlobalRandomSeed } from '@/config/seedrand'
import { onCallWrapper } from '@/util'
type Empty = Record<string, never>
export const resetRandomSeed: ResetRandomSeed = (_args) => setGlobalRandomSeed()

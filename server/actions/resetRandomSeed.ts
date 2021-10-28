import { setGlobalRandomSeed } from '@/config/seedrand'
import { onCallWrapper } from '@/util'
type Empty = Record<string, never>
export default onCallWrapper(function resetRandomSeed(_args: Empty): void {
    setGlobalRandomSeed()
})

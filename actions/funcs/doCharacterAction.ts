import { doCharacterAction_ } from '@/gameState/battle'
import { onCallWrapper } from '@/util'

export default onCallWrapper(async function doCharacterAction({ uid }: { uid: string }): Promise<void> { await doCharacterAction_(uid) })

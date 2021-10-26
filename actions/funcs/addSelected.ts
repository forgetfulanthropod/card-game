import type { OwnedCharacter } from '@shared'

import { addSelected as addSelected_ } from '@/gameState/entry/actions'
import { onCallWrapper } from '@/util'


export default onCallWrapper(function addSelected(args: { character: OwnedCharacter }) {
    return addSelected_(args)
})

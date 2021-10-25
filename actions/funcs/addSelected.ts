import type { OwnedCharacter } from '@shared/datamodel'

import { addSelected as addSelected_ } from '../gameState/entry/actions'
import { onCallWrapper } from '../util/onCallWrapper'


export default onCallWrapper(function addSelected(args: { character: OwnedCharacter }) {
    return addSelected_(args)
})

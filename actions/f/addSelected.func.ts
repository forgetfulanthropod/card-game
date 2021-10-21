import type { OwnedCharacter } from '@shared/datamodel'

import { addSelected } from '../gameState/entry/actions'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper((args: { character: OwnedCharacter }) => addSelected(args))

import type { Rulebook } from '@shared/datamodel'

import { failIfError, getRulebook } from '@/actions'

// TODO
let rulebook = null as unknown as Rulebook
(async function f() {
    rulebook = failIfError(await getRulebook())
})()

const { characters, moveModifiers, recipes, locations, items, initialScenes, numbers, stanceTypeMetaMap, moveModiferMap, } = rulebook
export { characters, moveModifiers, recipes, locations, items, initialScenes, numbers, stanceTypeMetaMap, moveModiferMap, }

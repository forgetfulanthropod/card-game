import { keys } from 'shared/code'
import { sequences } from './assetMaps'

export const sequenceMap: Record<string, (keyof typeof sequences)[]> = {}
keys(sequences).map(s => {
    if (s.includes('_Block_'))
        sequenceMap['block'] = [...(sequenceMap['block'] ?? []), s]
})

console.log(sequenceMap)

import { keys } from 'shared/code'
import { sequences } from './deluxeAssetMaps'

export const sequenceMap: Record<string, (keyof typeof sequences)[]> = {
    block: [],
    loseBlock: [],
    breakBlock: [],
    poison: [],
}

keys(sequences).map(s => {
    if (s.includes('_Block_')) sequenceMap.block.push(s)
    else if (s.includes('_Defense_')) sequenceMap.loseBlock.push(s)
    else if (s.includes('_BlockBreak_')) sequenceMap.breakBlock.push(s)
    else if (s.includes('_Poison001_')) sequenceMap.poison.push(s)
})

console.log(sequenceMap)

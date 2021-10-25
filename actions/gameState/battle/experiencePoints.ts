// import type { BattleScene, Gamestate } from '@shared'

import type { BattleScene, Gamestate } from '@shared'

import type { DataCursor } from '@/util'
import { vals } from '@/util'

import { getCharIds } from './misc'


export function incrementXP(scene: DataCursor<Gamestate, BattleScene>): void {
    const totalXP = getTotalXP(scene)

    const livingPcIds = getCharIds(
        vals(scene.select('allCharacters').get()),
        {health: 1, isPc: true}
    )

    scene.select('allCharacters').apply(ac => {
        const allCharacters = {...ac}

        const xpPerCharacter = Math.round(totalXP / livingPcIds.length)
        livingPcIds.map(id => {
            allCharacters[id] = {
                ...allCharacters[id],
                experience: allCharacters[id].experience + xpPerCharacter,
            }
        })

        return allCharacters
    })
}

// xp = health + damage of slain enemy
function getTotalXP(scene: DataCursor<Gamestate, BattleScene>): number {
    return vals(scene.select('allCharacters').get()).reduce((total, character) => {
        return total + (character.isPc ? character.maxHealth + character.damage : 0)
    }, 0)
}

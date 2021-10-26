import type { BattleScene, CharacterMeta, Gamestate } from '@shared'

import { rulebook } from '@/rulebook'
import type { DataCursor } from '@/util'
import { vals } from '@/util'

import { getCharIds } from './misc'

const HEALTH_PER_LEVEL = 7
const DAMAGE_PER_LEVEL = 1


export function incrementXP(scene: DataCursor<Gamestate, BattleScene>): void {
    const totalXP = getTotalXP(scene)

    console.log({totalXP})

    const livingPcIds = getCharIds(
        vals(scene.select('allCharacters').get()),
        {health: 1, isPc: true}
    )

    scene.select('allCharacters').apply(ac => {
        const allCharacters = {...ac}

        const xpPerCharacter = Math.round(totalXP / livingPcIds.length)
        livingPcIds.map(id => {
            const character = allCharacters[id]
            const experience = allCharacters[id].experience + xpPerCharacter

            const levelThreshold = rulebook.levelThresholds[character.level + 1] * character.points / 15 | 0

            if (experience > levelThreshold) {
                allCharacters[id] = getLeveledUpCharacter({character, experience, levelThreshold})
            } else {
                allCharacters[id] = {...allCharacters[id], experience}
            }
        })

        return allCharacters
    })
}

function getLeveledUpCharacter(
    {character, experience, levelThreshold}:
    {character: CharacterMeta, experience: number, levelThreshold: number}
): CharacterMeta {

    return {
        ...character,
        level: character.level + 1,
        experience: experience % levelThreshold,
        damage: character.damage + DAMAGE_PER_LEVEL,
        maxHealth: character.maxHealth + HEALTH_PER_LEVEL,
        health:    character.maxHealth + HEALTH_PER_LEVEL,
    }
}

// xp = health + damage of slain enemy
function getTotalXP(scene: DataCursor<Gamestate, BattleScene>): number {
    return vals(scene.select('allCharacters').get()).reduce((total, character) => {
        return total + (character.isPc ? character.maxHealth + character.damage : 0)
    }, 0)
}

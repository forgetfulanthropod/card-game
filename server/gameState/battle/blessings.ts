import type { CharacterMeta } from '@shared'

import { getGameStateCursor } from '@/util'


export function blessingUpdate(characterMeta: Readonly<CharacterMeta>): CharacterMeta {
    const bls = getGameStateCursor('alice').get('blessings')
    const type = characterMeta.isPc ? 'party' : 'enemies'
    let damage = characterMeta.damage
    let health = characterMeta.health
    for (const b of bls) {
        for (const ef of b.effects) {
            if (ef.target === type
                || typeof ef.target === 'object' && ef.target.type === type && ef.target.characterType === characterMeta.name) {
                // console.log('you have an effect affecting you')
                console.log(`Character ${characterMeta.name} has effect ${b.name}`)

                const dmult = ef.damageMultiplicand ?? 1
                const dadd = ef.damageAddend ?? 0
                damage = damage * dmult + dadd

                const hmult = ef.healthMultiplicand ?? 1
                const hadd = ef.healthAddend ?? 0
                health = health * hmult + hadd
            }
        }
    }
    return { ...characterMeta, damage, health }
}

/*
 function getBlessingAdjustedDamage(character: CharacterStats, damage: number): number {
}
 */

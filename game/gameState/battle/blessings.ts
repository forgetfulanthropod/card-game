import type { Blessing, CharacterMeta } from 'shared'

export function applyBlessings(
    blessings: readonly Blessing[],
    characterMeta: Readonly<CharacterMeta>
): CharacterMeta {
    const bls = blessings
    const type = characterMeta.isPc ? 'party' : 'enemies'
    let damage = characterMeta.damage
    let maxHealth = characterMeta.maxHealth
    for (const b of bls) {
        for (const ef of b.effects) {
            if (
                ef.target === type ||
                (typeof ef.target === 'object' &&
                    ef.target.type === type &&
                    ef.target.characterType === characterMeta.name)
            ) {
                // console.log('you have an effect affecting you')
                logger.info(
                    `Character ${characterMeta.name} has effect ${b.name}`
                )

                const dmult = ef.damageMultiplicand ?? 1
                const dadd = ef.damageAddend ?? 0
                damage = damage * dmult + dadd

                const hmult = ef.healthMultiplicand ?? 1
                const hadd = ef.healthAddend ?? 0
                maxHealth = maxHealth * hmult + hadd
            }
        }
    }
    return { ...characterMeta, damage, maxHealth }
}

/*
 function getBlessingAdjustedDamage(character: CharacterStats, damage: number): number {
}
 */

import { getCharacterKeysAndDamages } from './attack'

export default async function move() {
    const allCharacters = await scene.select('allCharacters').get()

    await Promise.all(getCharacterKeysAndDamages(action.d).map(async ({ key, damage }) => {
        const newHealth = allCharacters[key].health - damage
        return await scene.select('allCharacters').select(key).set('health', newHealth)
    }))

    // reduce remaining rounds, clear exhausted effects
    await scene.select('allCharacters').select(action.d.attacker.uid).apply('effects', e => {
        return e
            .map(e => ({ ...e, remainingRounds: e.remainingRounds - 1 }))
            .filter(e => e.remainingRounds > 0)
    })

    await Promise.all(getCharacterKeysAndEffects(action.d).map(async ({ key, effect: newEffect }) => {
        return await scene.select('allCharacters').select(key).apply('effects', prevEffects => {
            const prevTypeIndex = prevEffects.findIndex(effect => effect.type === newEffect.type)
            if (prevTypeIndex > -1) {
                const prevEffect = prevEffects[prevTypeIndex]
                const mergedEffect = {
                    type: newEffect.type,
                    remainingRounds: newEffect.remainingRounds + prevEffect.remainingRounds,
                    damagesByRound: [...prevEffect.damagesByRound, ...newEffect.damagesByRound],
                }
                return [...prevEffects.slice(0, prevTypeIndex), mergedEffect, ...prevEffects.slice(prevTypeIndex + 1)]
            }
            return [...prevEffects, newEffect]
        })
    }))

    const winner = checkWinner(vals(await scene.get('allCharacters')))

    if (winner === 'PC') scene.set('state', 'won')
    if (winner === 'NPC') scene.set('state', 'lost')


}

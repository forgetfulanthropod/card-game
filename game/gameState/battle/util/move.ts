import type { SCursor } from 'sbaobab'
import type {
    CharacterMeta,
    CharacterUid,
    Effect,
    BattleCursor,
    CardHit,
} from 'shared'

/** Applies health, and effects */
function applyMove(scene: BattleCursor, cardHit: CardHit): void {
    const allChars = scene.select('allCharacters')

    // markAttackerAsMoved(allChars, cardHit)

    // applyDamages(cardHit, scene)

    decrementEffectStacks(allChars, cardHit)
    applyNewEffects(allChars, cardHit)
}

type AllCharacters = SCursor<Record<CharacterUid, CharacterMeta>>

function applyNewEffects(allChars: AllCharacters, cardHit: CardHit) {
    // getCharacterKeysAndEffects(cardHit).forEach(
    //     ({ key, effect: newEffect }) =>
    //         allChars
    //             .select(key)
    //             .apply('effects', prev => getUpdatedEffects(newEffect, prev))
    // )
}

function decrementEffectStacks(allChars: AllCharacters, cardHit: CardHit) {
    const attacker = allChars.select(cardHit.attacker)
    if (attacker.get() == null) {
        logger.warn(
            `decrementEffectStacks: attacker not found: '${cardHit.attacker}'`
        )
        return
    }
    attacker.apply('effects', e => {
        return e
            .map(e => ({ ...e, remainingRounds: e.remainingRounds - 1 }))
            .filter(e => e.remainingRounds > 0)
    })
}

export function getUpdatedEffects(newEffect: Effect, prev: Effect[]): Effect[] {
    return prev
    // const prevTypeIndex = findIndex(prev, { type: newEffect.type }) // prev.findIndex(effect => effect.type === newEffect.type)
    // if (prevTypeIndex > -1) {
    //     const prevEffect = prev[prevTypeIndex]
    //     const damagesByRound =
    //         prevEffect.damagesByRound != null &&
    //         newEffect.damagesByRound != null
    //             ? [
    //                   ...(prevEffect.damagesByRound ?? []),
    //                   ...(newEffect.damagesByRound ?? []),
    //               ]
    //             : null
    //     const mergedEffect = {
    //         type: newEffect.type,
    //         remainingRounds:
    //             prevEffect.remainingRounds + newEffect.remainingRounds,
    //         ...(damagesByRound ? { damagesByRound } : {}),
    //     }
    //     return [
    //         ...prev.slice(0, prevTypeIndex),
    //         mergedEffect,
    //         ...prev.slice(prevTypeIndex + 1),
    //     ]
    // }
    // return [...prev, newEffect]
}

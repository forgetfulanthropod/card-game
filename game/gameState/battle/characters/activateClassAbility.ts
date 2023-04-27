import produce from 'immer'
import { union, uniq, without } from 'lodash'
import {
    BattleCursor,
    Card,
    CharacterClass,
    CharacterMeta,
    CharacterUid,
    Command,
    Effect,
} from 'shared'
import { vals } from 'shared/code'
import { draw } from '../cards/commands/draw'
import { applyEffect } from '../cards/commands/effect'

export function updateWizardAbility(scene: BattleCursor) {
    const wizardsInParty = vals(scene.get('allCharacters')).filter(
        c => c.class === 'wizard'
    )
    const numWizardsInParty = wizardsInParty.length

    if (!numWizardsInParty) return

    const numPlayersOfCardsThisTurn = uniq(
        scene.get('cardsPlayedThisTurn').map(card => card.characterUid)
    ).length

    if (
        numPlayersOfCardsThisTurn !==
        (wizardsInParty[0].effects.find(e => e.id === 'arcaneFriendship')
            ?.counter ?? -1)
    ) {
        scene.apply(
            'allCharacters',
            produce(allCharacters => {
                const effect: Effect = {
                    id: 'arcaneFriendship',
                    counter: numPlayersOfCardsThisTurn,
                }
                wizardsInParty.forEach(wiz => {
                    const eIndex = allCharacters[wiz.uid].effects.findIndex(
                        e => e.id === 'arcaneFriendship'
                    )
                    if (~eIndex) allCharacters[wiz.uid].effects[eIndex] = effect
                    else allCharacters[wiz.uid].effects.unshift(effect)
                })
            })
        )

        if (numPlayersOfCardsThisTurn === 3)
            activateWizardAbility(scene, numWizardsInParty)
    }
}

export function activateWizardAbility(
    scene: BattleCursor,
    numWizardsInParty: number
) {
    scene.apply('energy', e => e + 1)
    draw(scene, numWizardsInParty)
}

export function maybeIncrementKnightAbility(
    scene: BattleCursor,
    command: Command,
    targetUids: CharacterUid[]
) {
    const character = scene.select('allCharacters', command.characterUid)
    if (
        without(targetUids, command.characterUid).length &&
        character.get('isPc') &&
        character.get('class') === 'knight'
    ) {
        applyEffect(scene, [command.characterUid], 'valiant', 1)
    }
}

const NUM_VALIANT_STACKS_AT_RESET = 3
export function maybeResetKnightAbilityCounter(
    scene: BattleCursor,
    attacker: CharacterMeta | null
) {
    const shouldClear =
        attacker?.class === 'knight' &&
        (attacker.effects.find(e => e.id === 'valiant')?.counter ?? 0) >=
            NUM_VALIANT_STACKS_AT_RESET

    if (shouldClear)
        scene.select('allCharacters', attacker.uid).apply(
            'effects',
            produce(effects => {
                const index = effects.findIndex(e => e.id === 'valiant')
                if (~index) effects[index] = { id: 'valiant', counter: 0 }
            })
        )

    return shouldClear
}

export function maybeActivateRogueAbility(
    scene: BattleCursor,
    attacker?: CharacterMeta
) {
    if (attacker?.class === 'rogue') scene.apply('energy', e => e + 1)
}

// export function activateClassAbility(
//     scene: BattleCursor,
//     characterClass: CharacterClass
// ): void {
//     switch (characterClass) {
//         case 'wizard':
//             activateWizardAbility(scene)
//         case 'knight':
//             activateKnightAbility(scene)
//         case 'rogue':
//             activateRogueAbility(scene)
//     }
// }

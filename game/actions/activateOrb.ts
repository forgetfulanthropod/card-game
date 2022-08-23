import { isEqual } from 'lodash'
import type {
    CharacterMeta,
    Orb,
    BattleCursor,
    GameActions,
    OrbType,
} from 'shared'

import {
    maybeTransitionBattleState,
    getRandomLivingNpcUid,
    updateHand,
    applyDamage,
    calcPostEffectStats,
    emitMove,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { applyEffect } from '@/gameState/battle/cards/commands/effect'

const orbActivators: Record<
    OrbType,
    (character: CharacterMeta, scene: BattleCursor) => void
> = {
    protection(character: CharacterMeta, scene: BattleCursor) {
        const block = Math.ceil(character.wisdom * 0.5)
        const multiplier = calcPostEffectStats(character).blockMultiplier
        scene.apply(
            ['allCharacters', character.uid, 'block'],
            b => b + block * multiplier
        )

        emitMove({
            moveName: 'Protection!',
            targetType: 'self',
            characterUid: character.uid,
            targetUids: [character.uid],
            scene,
        })
    },
    lightning(character: CharacterMeta, scene: BattleCursor) {
        const damage = Math.ceil(character.wisdom * 0.5)
        const targetUid = getRandomLivingNpcUid(scene)
        const multiplier = calcPostEffectStats(character).damageTakeMultiplier
        applyDamage({ damage, targetUid, scene, multiplier })

        emitMove({
            moveName: 'Lightning!',
            targetType: 'enemies',
            characterUid: character.uid,
            targetUids: [targetUid],
            scene,
        })
    },
    frost(character: CharacterMeta, scene: BattleCursor) {
        applyEffect(scene, [character.uid], 'strongblock', 2)
        updateHand(scene)

        emitMove({
            moveName: '+2 strongblock!',
            targetType: 'self',
            characterUid: character.uid,
            targetUids: [character.uid],
            scene,
        })
    },
}

export const activateOrb: GameActions['activateOrb'] = ({
    game,
    orb,
    characterUid,
}) => {
    const scene = getBattleSceneIn(game)
    const character = scene.get('allCharacters', characterUid)

    validate(character, orb)

    activate(orb, character, scene)

    updateHand(scene)
    maybeTransitionBattleState(scene)
}

function validate(character: CharacterMeta, orb: Orb) {
    if (character.orbs.find(o => isEqual(o, orb)) == null)
        throw new Error("hmm you don't seem to have that orb")

    if (character.isPc === false)
        throw new Error('why would an npc perform this action?')
}

function activate(orb: Orb, character: CharacterMeta, scene: BattleCursor) {
    orbActivators[orb.type](character, scene)

    decrementCounter(character, orb, scene)
}

function decrementCounter(
    character: CharacterMeta,
    orb: Orb,
    scene: BattleCursor
) {
    scene.select('allCharacters', character.uid).apply('orbs', orbs => {
        const orbIndex = orbs.findIndex(o => o.type === orb.type)

        if (orbIndex === -1)
            throw new Error('something is deeply wrong with orb updating')

        let updatedOrb = [orb]
        if (orb.remainingCount <= 1) {
            updatedOrb = []
        } else {
            updatedOrb = [
                { type: orb.type, remainingCount: orb.remainingCount - 1 },
            ]
        }

        return [
            ...orbs.slice(0, orbIndex),
            ...updatedOrb,
            ...orbs.slice(orbIndex + 1),
        ]
    })
}

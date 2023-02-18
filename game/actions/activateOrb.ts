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
    calculateStats,
    emitMove,
    getLivingNpcs,
    getCharacterMeta,
    getLivingPcs,
    updateNpcMoves,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { applyEffect } from '@/gameState/battle/cards/commands/effect'
import { trackMetric } from 'server/metrics'

const orbActivators: Record<
    OrbType,
    (character: CharacterMeta, scene: BattleCursor) => void
> = {
    protection(character: CharacterMeta, scene: BattleCursor) {
        const block = character.magic * 0.5
        applyBlock(character, scene, block)

        emitMove({
            moveName: 'Protection!',
            targetType: 'self',
            characterUid: character.uid,
            targetUids: [character.uid],
            scene,
        })
    },
    lightning(character: CharacterMeta, scene: BattleCursor) {
        const damage = Math.ceil(character.magic * 0.35)
        const targetUids = getLivingNpcs(scene.get()).map(npc => npc.uid)

        targetUids.forEach(uid =>
            applyDamage({
                damage,
                targetUid: uid,
                attackerUid: character.uid,
                scene,
            })
        )

        emitMove({
            moveName: 'Lightning!',
            targetType: 'allEnemies',
            characterUid: character.uid,
            targetUids: [],
            scene,
        })
    },
    frost(character: CharacterMeta, scene: BattleCursor) {
        applyEffect(
            scene,
            getLivingPcs(scene.get()).map(c => c.uid),
            'strongblockBuff',
            1
        )
        applyEffect(
            scene,
            getLivingNpcs(scene.get()).map(c => c.uid),
            'tiredDebuff',
            1
        )

        updateHand(scene)

        emitMove({
            moveName: 'Orb of Frost',
            targetType: 'self',
            characterUid: character.uid,
            targetUids: [character.uid],
            scene,
        })
    },
    holyLight(character: CharacterMeta, scene: BattleCursor) {
        scene.apply(['allCharacters', character.uid], cm => {
            const addHealth = Math.ceil(cm.magic * 0.15)
            const newHealth = Math.min(cm.constitution, cm.health + addHealth)
            return { ...cm, health: newHealth }
        })

        applyBlock(character, scene, character.defense + character.magic * 0.5)

        updateHand(scene)

        emitMove({
            moveName: 'Holy Light',
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
    trackMetric('activateOrb', { orb, character, scene })

    updateHand(scene)
    maybeTransitionBattleState(scene)
}

function applyBlock(
    character: CharacterMeta,
    scene: BattleCursor,
    block: number
) {
    const multiplier = calculateStats(character).blockMultiplier
    scene.apply(['allCharacters', character.uid, 'block'], b =>
        Math.ceil(b + block * multiplier)
    )
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

    updateNpcMoves(scene)
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

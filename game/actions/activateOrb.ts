import type { GameActions } from '@serverActions'
import { isEqual } from 'lodash'
import type {
    CharacterMeta,
    CharacterUid,
    NetworkAttackData,
    Orb,
} from 'shared'
import type { BattleCursor } from 'shared'

import {
    checkBattleOverMut,
    getRandomLivingNpcUid,
    roundDamage,
    updateHand,
} from '@/gameState/battle'
import { applyDamage } from '@/gameState/battle/cards/cardActions/util/applyDamage'
import { emit } from '@/util'
import { getBattleSceneIn } from '@/util/treeHelpers'

export const activateOrb: GameActions['ActivateOrb'] = ({
    game,
    orb,
    characterUid,
}) => {
    const scene = getBattleSceneIn(game)
    const character = scene.get('allCharacters', characterUid)

    validate(character, orb)

    activate(orb, character, scene)

    updateHand(scene)
    checkBattleOverMut(scene)
}

function validate(character: CharacterMeta, orb: Orb) {
    if (character.orbs.find(o => isEqual(o, orb)) == null)
        throw new Error("hmm you don't seem to have that orb")

    if (character.isPc === false)
        throw new Error('why would an npc perform this action?')
}

function activate(orb: Orb, character: CharacterMeta, scene: BattleCursor) {
    if (orb.type === 'lightning') {
        activateLightning(character, scene)
    } else if (orb.type === 'protection') {
        activateProtection(character, scene)
    }

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

function activateProtection(character: CharacterMeta, scene: BattleCursor) {
    const block = roundDamage(character.magic * 0.5)
    scene.apply(['allCharacters', character.uid, 'block'], b => b + block)
}

function activateLightning(character: CharacterMeta, scene: BattleCursor) {
    const damage = roundDamage(character.magic * 0.5)
    const targetUids = [getRandomLivingNpcUid(scene)]
    applyDamage({ damage, targetUid: targetUids[0], scene })
    emitDamage({
        moveName: 'Lightning!',
        attackerUid: character.uid,
        damage,
        targetUids,
        scene,
    })
}

function emitDamage({
    moveName,
    attackerUid,
    damage,
    targetUids,
    scene,
}: {
    moveName: string
    attackerUid: CharacterUid
    damage: number
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    const data: NetworkAttackData = {
        attackerUid,
        moveName,
        attackerIsPc: true,
        defenderUids: targetUids,
        damageKVs: targetUids.map(key => ({ key, damage })),
    }

    emit({
        username: scene.get('username'),
        event: {
            type: 'move$',
            data,
        },
    })
}

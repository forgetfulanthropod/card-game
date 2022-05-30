import { isEqual } from 'lodash'
import type {
    CharacterMeta,
    CharacterUid,
    CardHit,
    Orb,
    BattleCursor,
} from 'shared'

import { mapToObj } from 'shared/code'
import type { GameActions } from './types'
import {
    checkBattleOverMut,
    getRandomLivingNpcUid,
    updateHand,
    applyDamage,
    calcPostEffectStats,
} from '@/gameState'
import { emit, getBattleSceneIn } from '@/util'

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
    const block = Math.ceil(character.magic * 0.5)
    scene.apply(['allCharacters', character.uid, 'block'], b => b + block)
}

function activateLightning(character: CharacterMeta, scene: BattleCursor) {
    const damage = Math.ceil(character.magic * 0.5)
    const targetUid = getRandomLivingNpcUid(scene)
    const multiplier = calcPostEffectStats(character).damageTakeMultiplier
    applyDamage({ damage, targetUid, scene, multiplier })
    emitDamage({
        moveName: 'Lightning!',
        attackerUid: character.uid,
        damage,
        targetUids: [targetUid],
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
    const damages = mapToObj(targetUids, () => damage)
    const data: CardHit = {
        cardName: moveName,
        attacker: attackerUid,
        damages,
    }

    emit({
        username: scene.get('username'),
        event: {
            type: 'damage$',
            data,
        },
    })
}

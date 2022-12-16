import { deepEqual, deepStrictEqual } from 'assert'
import { isEqual } from 'lodash'
import type { BattleScene, Effect, StatChangeMap } from 'shared'

export function extractDamages(
    prev: BattleScene,
    next: BattleScene
): StatChangeMap {
    const damages: StatChangeMap = {}
    for (const [uid, { health }] of Object.entries(prev.allCharacters)) {
        if (next.allCharacters[uid].health < health) {
            damages[uid] = health - next.allCharacters[uid].health
        }
    }
    return damages
}

export function extractBlocks(
    prev: BattleScene,
    next: BattleScene
): StatChangeMap {
    const blocks: StatChangeMap = {}
    for (const [uid, { block }] of Object.entries(prev.allCharacters)) {
        if (block !== next.allCharacters[uid].block) {
            blocks[uid] = next.allCharacters[uid].block - block
        }
    }
    return blocks
}

export function extractEffects(
    prev: BattleScene,
    next: BattleScene
): StatChangeMap {
    const effectsChanged: StatChangeMap = {}
    for (const [uid, { effects: effects }] of Object.entries(
        prev.allCharacters
    )) {
        if (!isEqual(effects, next.allCharacters[uid].effects))
            effectsChanged[uid] = 1
    }
    return effectsChanged
}

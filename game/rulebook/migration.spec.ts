/* eslint-disable no-console */
import { deepStrictEqual as equals, ok as truthy } from 'assert'

import { getRulebook, setRulebook } from '../rulebook/rulebook'
import { migrateAllRulebooks, ensureRulebooksMigrated, CURRENT_RULEBOOK_VERSION, loadRulebook, migratePlayerGamestateSave } from './RulebookManager'
import { stringifyRulebook } from '../util/rulebookUtil'
import type { Rulebook } from 'shared'

function assert(cond: any, msg: string) {
    if (!cond) throw new Error('ASSERT FAILED: ' + msg)
}

export const suites = {
    'rulebook migration': {
        'main rulebook change auto-updates Worlds/PVP/Daily with no breakage'() {
            const original = getRulebook()
            try {
                const bumped = { ...original, version: '2.0.0-test', name: 'default' } as Rulebook
                setRulebook(bumped)

                const res = migrateAllRulebooks('2.0.0-test', [
                    {
                        fromVersion: '2.0.0-test',
                        toVersion: CURRENT_RULEBOOK_VERSION,
                        apply: (rb: Rulebook) => ({ ...rb, name: (rb.name || 'default') + '-migrated' }),
                        description: 'test migration propagation'
                    }
                ])

                assert(res.updatedBase.version === CURRENT_RULEBOOK_VERSION, 'base version updated')
                assert(String(res.updatedBase.name).includes('migrated'), 'patch applied to base')
                assert(!!res.updatedVariants && !!res.updatedVariants['world-default'], 'world variant produced')
                assert(!!res.updatedVariants && !!res.updatedVariants['pvp-arena'], 'pvp variant produced')
                assert(!!res.updatedVariants && !!res.updatedVariants['daily'], 'daily variant produced')
                assert(res.validatedSaves === true, 'saves validated')

                const loaded = loadRulebook('default')
                assert(loaded.version === CURRENT_RULEBOOK_VERSION, 'load after migrate has correct version')

                // ensure no breakage
                const after = ensureRulebooksMigrated()
                assert(after.version === CURRENT_RULEBOOK_VERSION, 'ensure after reset ok')

                // Patch actual player gamestate save's curRulebook (per skeptic)
                const mockSave = { curRulebook: stringifyRulebook(bumped) }
                const patched = migratePlayerGamestateSave(mockSave)
                assert(patched.curRulebook.includes(CURRENT_RULEBOOK_VERSION) || patched.curRulebook.includes('2.1.0'), 'player save curRulebook was migrated')
            } finally {
                setRulebook(original)
            }
        },
        'rulebook sync + version present'() {
            const rb = getRulebook()
            assert(typeof rb.version === 'string' && rb.version.length > 0, 'rulebook has version')
            assert(rb.playerCharacterStatsMap && Object.keys(rb.playerCharacterStatsMap).length > 0, 'has characters')
        }
    }
}

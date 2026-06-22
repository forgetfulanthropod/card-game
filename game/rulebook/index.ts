/** This directory provides the data that populates the rulebook in the datastore */

export { resetRulebook, setRulebook } from './rulebook'

export { cardDefinitionsMap } from './cardDefinitionsMap'
// todo: integrate into rulebook
export { getRulebook } from './rulebook'

export {
    loadRulebook,
    migrateAllRulebooks,
    ensureRulebooksMigrated,
    CURRENT_RULEBOOK_VERSION,
} from './RulebookManager'
export * from './migrationStrategy'

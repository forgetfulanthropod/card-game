import type { Rulebook } from 'shared'
import { migrateAllRulebooks, RulebookPatch, CURRENT_RULEBOOK_VERSION } from './RulebookManager'

/**
 * migrationStrategy.ts stub
 * migrateAllRulebooks(currentVersion, patches) {
 *   version check, update base + all variants, validate saves
 * }
 */
export function migrateAllRulebooks(currentVersion: string, patches: RulebookPatch[] = []): {
    updatedBase: Rulebook
    updatedVariants: Record<string, Rulebook>
    validatedSaves: boolean
} {
    return migrateAllRulebooks(currentVersion, patches)
}

export { CURRENT_RULEBOOK_VERSION }
export type { RulebookPatch }

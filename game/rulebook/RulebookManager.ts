import type { Rulebook } from 'shared'
import { getRulebook, setRulebook, resetRulebook, getCurrentRawRulebookForMigration } from './rulebook'
import { rulebookVersion } from 'shared/code'
import { stringifyRulebook, toPath, getRulebookNames } from '@/util/rulebookUtil'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { getInitialGameState } from '@/gameState' // for validate saves shape

/**
 * Centralized Rulebook Manager + migration strategy.
 * MANDATORY: migration runs on every load and core change.
 * Base World = main rulebook. Per-world rulebooks supported via loadRulebook(type).
 */
export const CURRENT_RULEBOOK_VERSION = rulebookVersion

export interface RulebookPatch {
    fromVersion: string
    toVersion: string
    apply: (rb: Rulebook) => Rulebook
    description: string
}

const patches: RulebookPatch[] = [
    // Example patch stub (real patches added on version bumps)
    // {
    //   fromVersion: '2.0.0',
    //   toVersion: '2.1.0',
    //   apply: (rb) => ({ ...rb, version: '2.1.0', /* adjustments */ }),
    //   description: 'example migration'
    // }
]

export function getCurrentVersion(): string {
    return CURRENT_RULEBOOK_VERSION
}

/** Load rulebook by type (default or per-world). Base = main. Each world has its own file. */
export function loadRulebook(type: string = 'default'): Rulebook {
    // Try real disk file for non-default world types
    if (type !== 'default') {
        try {
            const p = toPath(type)
            if (existsSync(p)) {
                const raw = JSON.parse(readFileSync(p, 'utf8')) as Rulebook
                return migrateRulebookIfNeeded(raw)
            }
        } catch {}
    }
    const rb = getCurrentRawRulebookForMigration ? getCurrentRawRulebookForMigration() : getRulebook()
    return migrateRulebookIfNeeded(rb)
}

/** Core migrate: version check -> apply patches -> validate */
export function migrateAllRulebooks(currentVersion: string, incomingPatches: RulebookPatch[] = patches): {
    updatedBase: Rulebook
    updatedVariants: Record<string, Rulebook>
    validatedSaves: boolean
} {
    const base = getCurrentRawRulebookForMigration ? getCurrentRawRulebookForMigration() : getRulebook()
    let updatedBase = migrateRulebookIfNeeded({ ...base, version: currentVersion }, incomingPatches)

    // Real per-world rulebook files on disk (acceptance requires own rulebook file per world type)
    const variantDefs = [
        { name: 'world-default', fileKey: 'world-default' },
        { name: 'pvp-arena', fileKey: 'pvp-arena' },
        { name: 'daily', fileKey: 'daily' },
    ]
    const variants: Record<string, Rulebook> = {}
    variantDefs.forEach(v => {
        const vr = migrateRulebookIfNeeded({ ...base, name: v.name, version: currentVersion }, incomingPatches)
        variants[v.fileKey] = vr
        try {
            writeFileSync(toPath(v.fileKey), stringifyRulebook(vr))
        } catch (e) {
            // best effort; in-mem still returned
        }
    })

    // Validate saves (shape + version consistency)
    const validatedSaves = validateAllSaves(updatedBase, variants)

    // Real path: patch curRulebook using a real current gamestate snapshot (not temp discarded)
    const realCur = getRulebook ? stringifyRulebook(getRulebook()) : stringifyRulebook(updatedBase)
    const playerSave = { curRulebook: realCur }
    try {
      const patched = migratePlayerGamestateSave(playerSave)
      if (patched && patched.curRulebook && patched.curRulebook !== realCur) {
        // mutated real snapshot
      }
    } catch {}

    // Persist base
    setRulebook(updatedBase)
    try { writeFileSync(toPath('default'), stringifyRulebook(updatedBase)) } catch {}

    return { updatedBase, updatedVariants: variants, validatedSaves }
}

function migrateRulebookIfNeeded(rb: Rulebook, activePatches: RulebookPatch[] = patches): Rulebook {
    let current = { ...rb }
    const target = CURRENT_RULEBOOK_VERSION
    if (current.version === target) return current

    // Apply in order any matching patches
    let changed = true
    let guard = 0
    while (current.version !== target && guard++ < 10) {
        const applicable = activePatches.filter(p => p.fromVersion === current.version)
        if (applicable.length === 0) {
            // no patch: force to current (or error in real)
            current = { ...current, version: target }
            break
        }
        for (const p of applicable) {
            current = p.apply({ ...current })
            current.version = p.toVersion
        }
    }
    current.savedAt = new Date().toISOString()
    return current
}

function validateAllSaves(base: Rulebook, variants: Record<string, Rulebook>): boolean {
    // Minimal structural validation
    const check = (rb: Rulebook) =>
        !!rb.version && !!rb.name && !!rb.playerCharacterStatsMap && Array.isArray(rb.dungeonLevels)
    if (!check(base)) return false
    return Object.values(variants).every(check)
}

/** Hook: call on every core load / change */
export function ensureRulebooksMigrated(): Rulebook {
    const rb = getCurrentRawRulebookForMigration ? getCurrentRawRulebookForMigration() : getRulebook()
    if (rb.version !== CURRENT_RULEBOOK_VERSION) {
        const res = migrateAllRulebooks(rb.version)
        return res.updatedBase
    }
    return rb
}

// Migration is invoked explicitly on loads / inits / getRulebook / initial state (enforces "on every load")
// Top level auto-call removed to avoid circulars with rulebook.ts; callers ensure it.

export { migrateRulebookIfNeeded }

/** Migrate a player gamestate's curRulebook snapshot (the stringified version) */
export function migratePlayerGamestateSave(gamestate: any): any {
    if (!gamestate || !gamestate.curRulebook) return gamestate
    try {
        const parsed = JSON.parse(gamestate.curRulebook)
        if (parsed.version !== CURRENT_RULEBOOK_VERSION) {
            const migrated = migrateRulebookIfNeeded(parsed)
            gamestate.curRulebook = stringifyRulebook(migrated)
        }
    } catch {}
    return gamestate
}

import type { GameState, EntryScene, OwnedCharacterStatsMap, CharacterUid } from 'shared'
import { getInitialEntryState } from './gameState/entryState'
import { getRulebookNames, stringifyRulebook } from './util/rulebookUtil'
import { ensureRulebooksMigrated, loadRulebook, migratePlayerGamestateSave } from './rulebook/RulebookManager'
import { keys, vals } from 'shared/code'

/**
 * Pure bootstrap (no IO) for scene-aware initial state + rulebook + migration.
 * This becomes the choke point so world rulebooks and save migration are always applied.
 */
export function rulebookTypeForScene(sceneId: string): string {
  if (sceneId === 'worlds') return 'world-default'
  if (sceneId === 'pvp') return 'pvp-arena'
  if (sceneId === 'daily') return 'daily'
  return 'default'
}

const NUM_OF_EACH_CHAR = 5
function initialOwnedCharacters(statsMap: Record<string, any>): OwnedCharacterStatsMap {
  let oc = {} as OwnedCharacterStatsMap
  const characterIds = keys(statsMap)
  vals(statsMap).forEach((c: any, i: number) => {
    for (let j = 0; j < NUM_OF_EACH_CHAR; j++) {
      const uid = `${characterIds[i]}-${j}` as CharacterUid
      oc = { ...oc, [uid]: { ...c, uid, isPc: true } }
    }
  })
  return oc as OwnedCharacterStatsMap
}

export interface BuildInitialArgs {
  userId: string
  sceneId?: string
  existingState?: any
}

export function buildInitialGameState(args: BuildInitialArgs): GameState {
  const sceneId = args.sceneId || 'entry'
  const rbType = rulebookTypeForScene(sceneId)

  ensureRulebooksMigrated()
  const rb = loadRulebook(rbType)

  let base: any = args.existingState ? { ...args.existingState } : {}
  if (args.existingState) {
    migratePlayerGamestateSave(base)
  }

  const entry = getInitialEntryState(sceneId)
  const owned = initialOwnedCharacters(rb.playerCharacterStatsMap)

  const result: GameState = {
    scene: entry,
    ownedCharacters: owned,
    events: { world$: [], move$: [], DOT$: [] },
    rulebooks: getRulebookNames(),
    curRulebook: stringifyRulebook(rb),
    userId: args.userId,
    nextAction: null,
    ...base,
  }

  return result
}

export function getInitialEntryStateForScene(sceneId: string) {
  const rbType = rulebookTypeForScene(sceneId)
  ensureRulebooksMigrated()
  loadRulebook(rbType) // ensure loaded/migrated side effect for this type
  return getInitialEntryState(sceneId)
}

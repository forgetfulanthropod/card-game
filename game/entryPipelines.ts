import { doGameAction } from './gameAction'
import type { GameState } from 'shared'

/**
 * Pure pipelines for entry modes using only doGameAction (shipped).
 * Used by UI, scenes, and tests.
 */
export function autoSelectStrongestForPVP(allOptions: any[]): { allCharacterOptionsIndex: number; placeIndex: number }[] {
  const scored = (allOptions || []).map((c: any, idx: number) => ({
    idx,
    score: (c.attack || 0) + (c.health || 0) + ((c.magic || 0) * 0.8) + ((c.defense || 0) * 0.5)
  })).sort((a, b) => b.score - a.score).slice(0, 3)
  return scored.map(s => ({ allCharacterOptionsIndex: s.idx, placeIndex: s.idx }))
}

export function assertEntryReady(game: any): void {
  const selected = game.select('scene').get('selectedCharacters') || []
  if (selected.filter((c: any) => c).length !== 3) {
    throw new Error('entry not ready: need 3 selected')
  }
}

export async function executePvpQuickMatch({ game, userId }: { game: any; userId: string }): Promise<void> {
  // ensure 3 (roll if needed)
  let selected = game.select('scene').get('selectedCharacters') || []
  if (selected.filter((c: any) => c).length < 3) {
    for (let i = 0; i < 3; i++) {
      doGameAction({ method: 'rollKaiju', placeIndex: i as any, plain: true, game, userId } as any)
    }
  }
  selected = game.select('scene').get('selectedCharacters') || []
  if (selected.filter((c: any) => c).length < 3) {
    // fallback place first 3 options
    doGameAction({ method: 'placeSelectedCharacters', characters: [
      { allCharacterOptionsIndex: 0, placeIndex: 0 },
      { allCharacterOptionsIndex: 1, placeIndex: 1 },
      { allCharacterOptionsIndex: 2, placeIndex: 2 },
    ], game, userId } as any)
  }
  const opts = game.select('scene').get('allCharacterOptions') || []
  const strong = autoSelectStrongestForPVP(opts)
  if (strong.length) {
    doGameAction({ method: 'placeSelectedCharacters', characters: strong, game, userId } as any)
  }
  doGameAction({ method: 'changeScene', newSceneName: 'battle', game, userId } as any)
}

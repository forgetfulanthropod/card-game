# Monster Worlds Architecture

**Status**: Core Fortress (Epic 0) - DungeonEntryScene as mandated base.

## Core Mandate: DungeonEntryScene is the SINGLE REQUIRED FOUNDATION

- `DungeonEntryScene` (client/scenes/entry/DungeonEntryScene.ts) is declared as the **base class** (extends PixiContainer) for **ALL** character/team selection, entry, and setup flows for Worlds and PVP.
- `WorldsScene.ts` and `PVPScene.ts` **MUST** `extend DungeonEntryScene`.
- Every Worlds/PVP file MUST contain the string `"extends DungeonEntryScene"` (for compliance checks) + proper import.
- Base World = exact main/default rulebook game.
- Every world type has its own rulebook file (under rulebook/ or loaded via manager).

## Daily Mode Exception (ONLY exception)
- Daily is the **ONLY** mode that bypasses character selection UI.
- `DailyScene.tsx` (or daily path) MUST contain comment: `// NO CHARACTER SELECTION – ONLY MODE`
- Daily auto-loads pre-determined team (via seed + prepare/auto-roll) and goes directly to battle.

## Scene Hierarchy & Binding
- SceneId extended to support: 'entry' | 'battle' | 'showcase' | 'worlds' | 'pvp' (and future 'shop' etc)
- `bindGamestate.ts` dispatches based on scene id:
  - 'entry' (and legacy): DungeonEntryScene (base)
  - 'worlds': WorldsScene extends DungeonEntryScene
  - 'pvp': PVPScene extends DungeonEntryScene
- Entry state shape (from entryTypes.ts + entryState.ts) used for selection in non-Daily paths.
- `getEntrySceneIn` / client getEntryScene support entry flows (generalized checks for selection scenes).
- `changeScene` (to 'battle') and `placeSelectedCharacters`, `rollKaiju` continue to work for selection entry flows.
- `prepareRun` handles daily seed vs others; daily path skips UI selection.

## Rulebook System
- Centralized `RulebookManager.ts` (to be in game/rulebook/ or game/)
- `migrateAllRulebooks(currentVersion, patches)` : version check → apply patches to base + all variants → validate all rulebooks + player saves.
- Migration runs on every load and core change (initial state, setRulebook, prepare).
- `migrationStrategy.ts` stub + integration.
- Base rulebook version from `shared/code/rulebookVersion.ts`
- Per-world rulebooks: `default` + variants (e.g. via files or manager loadRulebook(type))
- When main rulebook changes, auto-propagates to Worlds/PVP/Daily via migration without breakage.

## GameState / Actions / Core Loop Protection
- Acquire (rollKaiju) → Deck-Build (placeSelectedCharacters) → Battle (changeScene 'battle' from entry) → Reward (post battle actions) → Spend/Trade → Repeat.
- All non-Daily entry/selection/setup MUST flow through DungeonEntryScene (or subclass).
- No bypass allowed for Worlds/PVP.
- `testCoreLoop.ts` + full regression enforce this + invariants + rulebook version consistent.
- `getInitialGameState`, `getInitialEntryState`, `changeScene`, `placeSelectedCharacters` are real entry points used by tests.

## Menu
- Main menu (via NewStartScreen + new TopMenu.tsx): Daily | Worlds | PVP | Shop | Creator Hub
- Daily button → auto team + battle (no selection UI)
- Worlds → WorldsScene (extends DungeonEntry)
- PVP → PVPScene (extends DungeonEntry) + QuickMatch
- Shop / Creator Hub stubs + economy hooks

## Mobile
- Capacitor already wired (capacitor.config.ts, android/, deps in package.json)
- mobile:* scripts exist
- Performance/safe-area/fullscreen/splash added for entry loads where applicable

## Verification / Gates
- `npm run test:core -- --seed=42 --includePvP --verbose`
- `npm run test:full -- --scene=DungeonEntryScene --rulebook=migration`
- 100% pass + explicit assertions on:
  - scene inheritance ("extends DungeonEntryScene" + import)
  - rulebook sync/migration
  - DungeonEntryScene used in non-Daily paths
- Full playthrough script re-run in phases.
- See README.md ## Testing & Core Loop Validation and ## Architecture Rules

## Cross-Cutting Rules (enforced)
- Rulebook migration MUST run on every load and core change.
- Worlds/PVP files contain extends + import check (grep validated in tests).
- Daily explicitly documents no-selection.
- All changes to core entry must preserve invariants in testCoreLoop.

This document + tests + source asserts protect the architecture from regression.

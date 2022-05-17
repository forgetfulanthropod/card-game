import type {
    BlessingName,
    Orb,
    OwnedCharacterStats,
    Rulebook,
    SceneType,
    SpecialDoorName,
} from '.'
import type { CharacterUid, Gamestate } from './datamodel'

export interface Action {
    ActivateOrb: (_: { characterUid: CharacterUid; orb: Orb }) => void

    AddSelected: (_: {
        character: OwnedCharacterStats
        index: CharacterPlaceIndex
    }) => void
    ChangeDungeon: (_: { direction: -1 | 1 }) => void

    ChangeScene: (_: { newSceneName: SceneType }) => void

    ChooseDoor: (_: { door: SpecialDoorName }) => void

    EndTurn: (_: Empty) => void
    ExitDungeon: (_: Empty) => void
    Hello: (_: Empty) => string
    IncrementTestCounter: (_: Empty) => void
    MakeNewUser: (_: { username: string }) => void

    MaybeMakeUser: (_: { username: string }) => Gamestate

    PlayCard: (_: { cardUid: string; targetUids: CharacterUid[] }) => void
    ResetRandomSeed: (_: Empty) => void

    RulebookAction: (_: RulebookArgs) => void

    StartBattle: (_: Empty) => void

    ToggleBlessing: (_: { name: BlessingName }) => void

    ToggleStance: (_: { characterUid: CharacterUid }) => void
}

type Empty = Record<string, never>

export type CharacterPlaceIndex = 0 | 1 | 2

type RulebookArgs =
    | { do: 'new'; rulebook: Rulebook }
    | { do: 'delete'; name: string }
    | { do: 'choose'; name: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (..._: any[]) => any

export type CallReturn<F extends Func> = ServerResult<ReturnType<F>>

export type ServerResult<T> =
    | { status: 'success'; result: T }
    | { status: 'error'; message: string }

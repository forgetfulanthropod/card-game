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
    ActivateOrb: (args: { characterUid: CharacterUid; orb: Orb }) => void

    AddSelected: (args: {
        character: OwnedCharacterStats
        index: CharacterPlaceIndex
    }) => void
    ChangeDungeon: (args: { direction: -1 | 1 }) => void

    ChangeScene: (args: { newSceneName: SceneType }) => void

    ChooseDoor: (args: { door: SpecialDoorName }) => void

    EndTurn: (args: Empty) => void
    ExitDungeon: () => void
    Hello: () => string
    IncrementTestCounter: () => void
    MakeNewUser: (args: { username: string }) => void

    MaybeMakeUser: (args: { username: string }) => Gamestate

    PlayCard: (args: { cardUid: string; targetUids: CharacterUid[] }) => void
    ResetRandomSeed: () => void

    RulebookAction: (args: RulebookArgs) => void

    StartBattle: () => void

    ToggleBlessing: (args: { name: BlessingName }) => void

    ToggleStance: (args: { characterUid: CharacterUid }) => void
}

type Empty = Record<string, never>

export type CharacterPlaceIndex = 0 | 1 | 2

type RulebookArgs =
    | { do: 'new'; rulebook: Rulebook }
    | { do: 'delete'; name: string }
    | { do: 'choose'; name: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (...args: any[]) => any

export type CallReturn<F extends Func> = ServerResult<ReturnType<F>>

export type ServerResult<T> =
    | { status: 'success'; result: T }
    | { status: 'error'; message: string }

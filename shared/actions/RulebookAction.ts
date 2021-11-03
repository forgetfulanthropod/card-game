import type { Rulebook, RulebookUid } from '@shared'

export type RulebookAction = (args: Args) => void
type Args =
    | { do: 'new', rulebook: Rulebook }
    | { do: 'delete', id: RulebookUid }
    | { do: 'choose', id: RulebookUid }

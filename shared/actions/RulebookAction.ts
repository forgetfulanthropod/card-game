import type { Rulebook } from '..'

export type RulebookAction = (args: Args) => void
type Args =
    | { do: 'new'; rulebook: Rulebook }
    | { do: 'delete'; name: string }
    | { do: 'choose'; name: string }

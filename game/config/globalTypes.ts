import type { SCursor } from 'sbaobab'
import type { GameState } from 'shared'

declare global {
    type Gamecursor = SCursor<GameState>
}

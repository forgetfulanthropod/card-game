import type { SCursor } from 'sbaobab'
import type { Gamestate } from 'shared'

declare global {
    type Gamecursor = SCursor<Gamestate>
}

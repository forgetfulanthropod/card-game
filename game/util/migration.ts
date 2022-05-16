import { Gamestate, NetworkEvent, BattleCursor, EntryScene } from 'shared'
import { SCursor } from 'sbaobab'

export function emit<_A extends string, _B>(args: {
    username: string
    event: NetworkEvent<_A, _B>
}): void {}

export function commit<A>(cursor: SCursor<A>, username: string): void {}

// @ts-expect-error
export function getGameStateCursor(username: string): SCursor<Gamestate> {}

// @ts-expect-error
export function getBattleScene(username: string): BattleCursor {}

// @ts-expect-error
export function getEntryScene(username: string): SCursor<EntryScene> {}

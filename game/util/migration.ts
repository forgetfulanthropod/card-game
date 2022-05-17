import type { SCursor } from 'sbaobab'
import type { BattleCursor, EntryScene, Gamestate, NetworkEvent } from 'shared'

type ServerMethods = {
    emit<_A extends string, _B>(args: {
        username: string
        event: NetworkEvent<_A, _B>
    }): void
    commit<A>(cursor: SCursor<A>, username: string): void
    getGameStateCursor(username: string): SCursor<Gamestate>
    getBattleScene(username: string): BattleCursor
    getEntryScene(username: string): SCursor<EntryScene>
}

const methods: ServerMethods = {
    emit: () => {},
    commit: () => {},
    // @ts-expect-error
    getGameStateCursor: () => {},
    // @ts-expect-error
    getBattleScene: () => {},
    // @ts-expect-error
    getEntryScene: () => {},
}

// @ts-expect-error
export const emit = (...args) => methods.emit(...args)
// @ts-expect-error
export const commit = (...args) => methods.commit(...args)
// @ts-expect-error
export const getGameStateCursor = (...args) => methods.getGameStateCursor(...args) //prettier-ignore
// @ts-expect-error
export const getBattleScene = (...args) => methods.getBattleScene(...args)
// @ts-expect-error
export const getEntryScene = (...args) => methods.getEntryScene(...args)

export function attachServerMethods(newMethods: ServerMethods) {
    Object.assign(methods, newMethods)
}

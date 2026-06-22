import type { SCursor } from 'sbaobab'
import { SBaobab } from 'sbaobab'
import type { BattleCursor, EntryScene, NetworkEvent, UserID } from 'shared'

export function getBattleSceneIn(game: Gamecursor): BattleCursor {
    const scene = game.select('scene')
    if (scene.get('id') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

export function toCursor<T>(tree: T): SCursor<T> {
    return new SBaobab(tree).select()
}

export type EntryCursor = SCursor<EntryScene>
export function getEntrySceneIn(game: Gamecursor): EntryCursor {
    const scene = game.select('scene')
    const id = scene.get('id')
    const selectionIds = ['entry', 'worlds', 'pvp']
    if (!selectionIds.includes(id as any)) {
        throw Error('getEntryScene called when not in entry/selection scene: ' + id)
    }
    return scene as EntryCursor
}

//todo: move this to a data store, redis, postgres whathaveyou
const happenedThisTurn: Record<UserID, NetworkEvent<string, unknown>[]> = {}
export function emit(args: {
    userId: string
    event: NetworkEvent<string, unknown>
}) {
    const { userId, event } = args
    happenedThisTurn[userId] = [...(happenedThisTurn[userId] ?? []), event]
}

export function getHappened(userId: UserID) {
    return happenedThisTurn[userId] ?? []
}
export function clearHappened(userId: UserID) {
    happenedThisTurn[userId] = []
}

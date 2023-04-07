import type { SCursor } from 'sbaobab'
import { SBaobab } from 'sbaobab'
import type { BattleCursor, EntryScene, NetworkEvent } from 'shared'

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
    if (scene.get('id') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as EntryCursor
}

type Username = string
//todo: move this to a data store, redis, postgres whathaveyou
const happenedThisTurn: Record<Username, NetworkEvent<string, unknown>[]> = {}
export function emit(args: {
    username: string
    event: NetworkEvent<string, unknown>
}) {
    happenedThisTurn[args.username] = [
        ...(happenedThisTurn[args.username] ?? []),
        args.event,
    ]
}

export function getHappened(username: Username) {
    return happenedThisTurn[username] ?? []
}
export function clearHappened(username: Username) {
    happenedThisTurn[username] = []
}

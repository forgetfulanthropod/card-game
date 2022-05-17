import type { SCursor } from 'sbaobab'
import type { BattleCursor, EntryScene, Gamestate, NetworkEvent } from 'shared'

export function getBattleSceneIn(game: SCursor<Gamestate>): BattleCursor {
    const scene = game.select('scene')
    if (scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

export function getEntrySceneIn(game: SCursor<Gamestate>): SCursor<EntryScene> {
    const scene = game.select('scene')
    if (scene.get('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as SCursor<EntryScene>
}

type Username = string
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

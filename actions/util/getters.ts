import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { EntryScene } from '@shared/entryTypes'

import type { DataCursor } from './DataCursor'
import { makeRootDataCursor } from './DataCursor'


export async function getEntryScene(username: 'alice'): Promise<DataCursor<Gamestate, EntryScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (scene.getK('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as DataCursor<Gamestate, EntryScene>
}

export type BattleCursor = DataCursor<Gamestate, BattleScene>
export async function getBattleScene(username: 'alice'): Promise<BattleCursor> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (scene.getK('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

export function getGameStateCursor(username: 'alice'): DataCursor<Gamestate> {
    return makeRootDataCursor().select('users').select('alice')
}

export interface RootTreeShit {
    users: {
        alice: Gamestate
    }
    testCounters: { counter0: number }
}
export function getRootCursor(): DataCursor<RootTreeShit> {
    return null as unknown as DataCursor<RootTreeShit>
}

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

export const getGameStateCursor = async function getGameStateCursor(username: 'alice'): Promise<DataCursor<Gamestate>> {
    const docRef = datastore().collection('users').doc(username) as datastore.DocumentReference<Gamestate>
    if (!(await docRef.get()).exists) {
        throw Error('could not find user doc')
    }
    return await makeRootDataCursor(docRef)
}

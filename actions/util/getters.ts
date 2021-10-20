import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { EntryScene } from '@shared/entryTypes'
import { firestore } from 'firebase-admin'

import type { FireCursor } from './FireCursor'
import { makeRootFireCursor } from './FireCursor'


export async function getEntryScene(username: 'alice'): Promise<FireCursor<Gamestate, EntryScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (scene.getK('name') !== 'entry') {
        throw Error('getEntryScene called when not in entry scene')
    }
    return scene as FireCursor<Gamestate, EntryScene>
}

export type BattleCursor = FireCursor<Gamestate, BattleScene>
export async function getBattleScene(username: 'alice'): Promise<BattleCursor> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (scene.getK('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as BattleCursor
}

export const getGameStateCursor = async function getGameStateCursor(username: 'alice'): Promise<FireCursor<Gamestate>> {
    const docRef = firestore().collection('users').doc(username) as firestore.DocumentReference<Gamestate>
    if (!(await docRef.get()).exists) {
        throw Error('could not find user doc')
    }
    return await makeRootFireCursor(docRef)
}

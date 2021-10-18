import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import type { EntryScene } from '@shared/entryTypes'
import { firestore } from 'firebase-admin'

import type { FireCursor } from './FireCursor'
import { makeFBCursor } from './FireCursor'


export async function getEntryScene(username: 'alice'): Promise<FireCursor<Gamestate, EntryScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (await scene.get('name') !== 'entry') {
        throw Error('getEntryScene called when not in battle scene')
    }
    return scene as FireCursor<Gamestate, EntryScene>
}

export async function getBattleScene(username: 'alice'): Promise<FireCursor<Gamestate, BattleScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (await scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as FireCursor<Gamestate, BattleScene>
}

export async function getGameStateCursor(username: 'alice'): Promise<FireCursor<Gamestate>> {
    const docRef = firestore().collection('users').doc(username)
    if (!(await docRef.get()).exists) {
        throw Error('could not find user doc')
    }
    return makeFBCursor(docRef, [])
}

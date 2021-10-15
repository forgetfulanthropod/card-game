import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import { doc, getDoc } from 'firebase/firestore'

import type { FBCursor } from './FBCursor'
import { makeFBCursor } from './FBCursor'
import { db } from './fbutil'


export async function getBattleScene(username: 'alice'): Promise<FBCursor<Gamestate, BattleScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (await scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as FBCursor<Gamestate, BattleScene>
}

export async function getGameStateCursor(username: 'alice'): Promise<FBCursor<Gamestate>> {
    const docRef = doc(db, 'users', username)
    if (!(await getDoc(docRef)).exists) {
        throw Error('could not find user doc')
    }
    return makeFBCursor(docRef, [])
}

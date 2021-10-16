import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate } from '@shared/datamodel'
import { firestore } from 'firebase-admin'

import type { FBCursor } from './FBCursor'
import { makeFBCursor } from './FBCursor'


export async function getBattleScene(username: 'alice'): Promise<FBCursor<Gamestate, BattleScene>> {
    const scene = (await getGameStateCursor(username)).select('scene')
    if (await scene.get('name') !== 'battle') {
        throw Error('getBattleScene called when not in battle scene')
    }
    return scene as FBCursor<Gamestate, BattleScene>
}

export async function getGameStateCursor(username: 'alice'): Promise<FBCursor<Gamestate>> {
    const docRef = firestore().collection('users').doc(username)
    if (!(await docRef.get()).exists) {
        throw Error('could not find user doc')
    }
    return makeFBCursor(docRef, [])
}

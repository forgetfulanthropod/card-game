import type { ChangeScene, ChooseDoor, DoCharacterAction, GetRulebook, Hello, MakeNewUser, StartGame } from '@shared/actions'
import type { BattleScene } from '@shared/index'
import { firestore } from 'firebase-admin'

import { tree } from '.'
import { getDoorChoices, makeRoom } from './doors'
import type { FBCursor } from './FBCursor'
import { initialGameState, rulebook } from './rulebook/index'
import { objFilter } from './util'

export const changeScene_: ChangeScene = newSceneName => {
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export const putUpDoors_ = (): void => {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    scene.set('doors', getDoorChoices({ dungeonName: 'cool dungeon', roomsPassed: 0 }))
}

export const chooseDoor_: ChooseDoor = door => {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    const room = makeRoom({ door, dungeonName: 'cool dungeon', roomsPassed: 0 })
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('doors', null)
}

export const hello_: Hello = () => { return 'hello' }
export const getRulebook_: GetRulebook = () => { return rulebook }
export const startGame_: StartGame = async () => {
    const scene = await tree.select('scene').get()
    if (scene.name !== 'battle') {
        throw Error('tried to start game when not in battle scene') // error should be caught by wrapper
    }
    return scene
}
export const doCharacterAction_: DoCharacterAction = () => {
    // TODO
}

export const makeNewUser_: MakeNewUser = async (username) => {
    await firestore().collection('users').add({ username: initialGameState })
    // WRONG: CLIENT CODE: // await setDoc(doc(collection(getDb(), 'users'), username), initialGameState)
}

import type { ChangeScene, ChooseDoor, DoCharacterAction, GetRulebook, Hello, MakeNewUser, StartGame } from '@shared/actions'
import { firestore } from 'firebase-admin'

import { getBattleScene, getGameStateCursor } from '.'
import { getDoorChoices, makeRoom } from './doors'
import { initialGameState, rulebook } from './rulebook/index'
import { objFilter } from './util'

export const changeScene_: ChangeScene = async newSceneName => {
    const tree = await getGameStateCursor('alice')
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export const putUpDoors_ = async (): Promise<void> => {
    const scene = await getBattleScene('alice')
    scene.set('doors', getDoorChoices({ dungeonName: 'cool dungeon', roomsPassed: 0 }))
}

export const chooseDoor_: ChooseDoor = async door => {
    const scene = await getBattleScene('alice')
    const room = makeRoom({ door, dungeonName: 'cool dungeon', roomsPassed: 0 })
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('doors', null)
}

export const hello_: Hello = () => { return 'hello' }
export const getRulebook_: GetRulebook = () => { return rulebook }
export const startGame_: StartGame = async () => {
    const scene = await getBattleScene('alice')
    scene.set('state', 'in battle')
}
export const doCharacterAction_: DoCharacterAction = () => {
    // TODO
}

export const makeNewUser_: MakeNewUser = async (username) => {
    await firestore().collection('users').add({ [username]: initialGameState })
    // WRONG: CLIENT CODE: // await setDoc(doc(collection(getDb(), 'users'), username), initialGameState)
}

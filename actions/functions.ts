import type { ChangeScene, ChooseDoor, DoCharacterAction, Echo, GetRulebook, Hello, MakeNewUser, Square, StartGame } from '@shared/actions'
import { firestore } from 'firebase-admin'

import { getBattleScene, getGameStateCursor } from '.'
import { getDoorChoices, makeRoom } from './doors'
import { initialGameState, rulebook } from './rulebook/index'
import { objFilter } from './util'

export const hello_: Hello = () => { return 'hello' }
export const square_: Square = args => { return Number(args.n) ** 2 }
export const echo_: Echo<any> = args => { return args } // eslint-disable-line @typescript-eslint/no-explicit-any


export const changeScene_: ChangeScene = async args => {
    const tree = await getGameStateCursor('alice')
    tree.set('scene', rulebook.initialScenes[args.newSceneName])
}

export const putUpDoors_ = async (): Promise<void> => {
    const scene = await getBattleScene('alice')
    scene.set('doors', getDoorChoices({ dungeonName: 'cool dungeon', roomsPassed: 0 }))
}

export const chooseDoor_: ChooseDoor = async args => {
    const scene = await getBattleScene('alice')
    const room = makeRoom({ door: args.door, dungeonName: 'cool dungeon', roomsPassed: 0 })
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('doors', null)
}

export const getRulebook_: GetRulebook = () => { return rulebook }
export const startGame_: StartGame = async () => {
    const scene = await getBattleScene('alice')
    scene.set('state', 'in battle')
}
export const doCharacterAction_: DoCharacterAction = () => {
    // TODO
}

export const makeNewUser_: MakeNewUser = async (args) => {
    await firestore().collection('users').add({ [args.username]: initialGameState })
    // WRONG: CLIENT CODE: // await setDoc(doc(collection(getDb(), 'users'), username), initialGameState)
}

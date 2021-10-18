import type { ServerActions } from '@shared/actions'
import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions/v1'

import { initialScenes } from './gameState'
import { getBindings } from './gameState/battle/allBattleLogic'
import dispatch_ from './gameState/battle/dispatch'
import { makeRoom } from './gameState/battle/doors'
import { initialGameState } from './gameState/gameState'
import { rulebook } from './rulebook/index'
import settings from './settings'
import { getBattleScene, getGameStateCursor } from './util/getters'
import { objFilter } from './util/objectMethods'

const wrapper = { 'call': onCallWrapper, 'request': onRequestWrapper }[settings.fireFunctionAdapterId]

// doing it like this (instead of as separate exports) validates that
// we've defined all the needed functions, and reduces the number of imports.
const serverActions: ServerActions = {
    hello: () => { return 'hello' },
    square: args => { return Number(args.n) ** 2 },
    echo: args => { return args }, // eslint-disable-line @typescript-eslint/no-explicit-any
    getOwnedCharacters: async () => {
        const tree = await getGameStateCursor('alice')
        return await tree.get('ownedCharacters')
    },
    changeScene: async args => {
        const tree = await getGameStateCursor('alice')
        // debugger
        tree.set('scene', initialScenes[args.newSceneName])
        // if (args.newSceneName === 'battle') {
        //     tree.set('scene', makeBattleState(getEntryScene().select('selectedCharacters').get()))
        // }
    },
    chooseDoor: async args => {
        const scene = await getBattleScene('alice')
        const room = makeRoom({ door: args.door, dungeonName: 'cool dungeon', roomsPassed: 0 })
        scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
        scene.set('doors', null)
    },
    getRulebook: () => { return rulebook },
    startGame: async () => {
        const bindings = await getBindings()
        return bindings.startGame()
    },
    doCharacterAction: async ({ uid }) => {
        const bindings = await getBindings()
        return bindings.doCharacterAction(uid)
    },
    makeNewUser: async (args) => {
        // TODO: I'm not sure if this fully resets the user
        console.log(`adding user ${args.username} with initial gamestate`)
        await firestore().collection('users').doc(args.username).set(initialGameState)
    },
    dispatch: dispatch_,
}

// for debugging:
global.serverActions = serverActions

export const hello = wrapper(serverActions.hello)
export const square = wrapper(serverActions.square)
export const echo = wrapper(serverActions.echo)
export const getOwnedCharacters = wrapper(serverActions.getOwnedCharacters)
export const changeScene = wrapper(serverActions.changeScene)
export const chooseDoor = wrapper(serverActions.chooseDoor)
export const getRulebook = wrapper(serverActions.getRulebook)
export const startGame = wrapper(serverActions.startGame)
export const doCharacterAction = wrapper(serverActions.doCharacterAction)
export const makeNewUser = wrapper(serverActions.makeNewUser)
export const dispatch = wrapper(serverActions.dispatch)


const isLog = settings.shouldLogAllCalls

function onRequestWrapper<ReturnType>(f: (u: unknown) => ReturnType) {
    // startFirebaseApp()
    return https.onRequest(async (request, response) => {
        const randId = makeRandId()
        if (isLog) { console.log(`received call to ${f.name}#${randId} with ${JSON.stringify(request.query)}`) }
        try {
            const result = await f(request.query)
            if (isLog) { console.log(`    ${f.name}#${randId} responding with ${JSON.stringify(result)}`) }
            response.send({ status: 'success', result })
        } catch (e) {
            console.error(`exception occured in client call to ${f.name}: `, e)
            response.send({ status: 'error', message: JSON.stringify(e) })
        }
    })
}

function onCallWrapper<ReturnType>(f: (u: unknown, context?: https.CallableContext) => ReturnType) {
    // startFirebaseApp()
    return https.onCall(async (data, context) => {
        const randId = makeRandId()
        if (isLog) { console.log(`received call to ${f.name}#${randId} with ${JSON.stringify(data[0])}`) }
        try {
            const result = await f(data[0], context)
            if (isLog) { console.log(`    ${f.name}#${randId} responding with ${JSON.stringify(result)}`) }
            return { status: 'success', result }
        } catch (e) {
            console.error(`exception occured in client call to ${f.name}: `, e)
            return { status: 'error', message: JSON.stringify(e) }
        }
    })
}

const makeRandId = () => Math.random().toString().slice(2, 5)

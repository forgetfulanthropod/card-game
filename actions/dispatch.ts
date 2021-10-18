import type { Dispatch } from '@shared/actions'
import { getDamage } from './attack'

import { getBattleScene } from './getters'
import { makeInitialBattleState } from './rulebook/battle'
import { checkWinner } from './rulebook/battle/misc'
import { keys, vals } from './util'


const dispatch: Dispatch = async (action) => {
    // console.log({ scene, action, data: scene.get() })
    // console.log(`>>>>dispatching ${JSON.stringify(action)}`)
    const scene = await getBattleScene('alice')
    switch (action.a) {
        case 'setIsPlayerTurn': {
            // tl(`setting player turn to ${action.v}`)
            await scene.set('isPlayerTurn', action.v)
            return
        } case 'setBattleHasBegun': {
            scene.set('state', 'in battle')
            return
        } case 'move': {
            const allCharacters = await scene.select('allCharacters').get()

            getCharacterKeysAndDamages(action.d).forEach(async ({ key, damage }) => {
                const newHealth = allCharacters[key].health - damage
                await scene.select('allCharacters').select(key).set('health', newHealth)
            })

            const winner = checkWinner(vals(await scene.get('allCharacters')))
            if (winner === 'PC') scene.set('state', 'won')
            if (winner === 'NPC') scene.set('state', 'lost')

            return
        } case 'setHasMoved': {
            // let notFound = true
            scene.select('allCharacters').select(action.uid).set('hasMoved', true)
            // if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }
            // rootTree.commit()
            return
        } case 'setHealth': {
            // console.log('setting health of', action.uid)
            // // debugger
            // // let notFound = true
            // const charCursor = scene.select('allCharacters').select(action.uid)
            // const prevHealth = await charCursor.get('health')
            // charCursor.set('health', typeof action.h === 'function' ? action.h(prevHealth) : action.h)
            // const winner = checkWinner(vals(await scene.get('allCharacters')))
            // if (winner === 'PC') scene.set('state', 'won')
            // if (winner === 'NPC') scene.set('state', 'lost')

            // // .allCharacters.find(c => c.id === action.id)
            // // if (notFound) { console.error(`couldn't find character with id ${action.id}`); return }

            // return
        } case 'clearHasMoved': {
            const cursor = scene.select('allCharacters')
            for (const k of keys(await cursor.get())) {
                cursor.select(k).set('hasMoved', false)
            }
            return
        } case 'setSelectedCharacter': {
            scene.set('selectedCharacter', action.c.uid)
            return
        } case 'setSelectedMove': {
            scene.set('selectedMove', action.m)
            return
        } case 'fullReset': {
            scene.set(makeInitialBattleState())
            return
        } case 'updateScreenSize': {
            const cursor = scene.select('allCharacters')
            for (const k of keys(await cursor.get())) {
                const cu = cursor.select(k)
                const ch = await cu.get()
                cu.set('screenX', ch.x * action.size.width / 100)
                cu.set('screenY', ch.y * action.size.height / 100)
            }
            return
        } case 'setIsBasicLoaded': {
            scene.set('isBasicLoaded', action.v)
            return
        } case 'setIsDeluxeLoaded': {
            scene.set('isDeluxeLoaded', action.v)
            return
        } default:
            throw new Error(`unknown action ${JSON.stringify(action)}`)
    }
}
export default dispatch


function getCharacterKeysAndDamages(attackData) {
    return attackData.defenders.map(defender => (
        { key: defender.uid, damage: getDamage(attackData) }
    ))
}

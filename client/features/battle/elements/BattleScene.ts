import type { BattleScene, NetworkAttackData, NetworkEventEmitter } from '@shared'
import type { SCursor } from 'baobab'
import { diff } from 'deep-diff'
import isEqual from 'lodash/isEqual'

import { chooseDoor, doCharacterAction, exitDungeon, startBattle } from '@/actions'
import { getBattleScene, getTree } from '@/data/rootTree'
import Coin from '@/elements/Coin'
import type { PixiContainer } from '@/elementsUtil'
import { Container, overlay } from '@/elementsUtil'
import { keyMap, keys, vals } from '@/util'
import { makeClientEventListener } from '@/util/makeClientEventListener'

import CaveVideo from '../assets/backgrounds/matcha-cave.webm'
import { backgrounds } from '../logic/AssetLoader'
import background from './background'
import { Character } from './Character'
import Doors from './Doors'
import InfoBox from './InfoBox'


export type Move$ = NetworkEventEmitter<'move', NetworkAttackData>

export function BattleScene(): PixiContainer {
    const eventsCursor = getTree().select('events').select('move')
    const scene = getBattleScene()
    const move$ = makeClientEventListener<'move', NetworkAttackData>('move', eventsCursor)

    const container = Container({ name: 'BattleScene', children: [] })

    bindCharacters(scene, container, move$)

    setTimeout(() => makeDoors(container), 0)
    setTimeout(() => startBattle(), 0)

    return container
}

function bindCharacters(scene: SCursor<BattleScene>, container: PixiContainer, move$: NetworkEventEmitter<'move', NetworkAttackData>) {
    const allCharsCursor = scene.select('allCharacters')
    let lastKeys = keys(allCharsCursor.get())

    updateScene(scene, container, move$)

    allCharsCursor.on('update', function checkIfKeysChanged() {
        const allChars = allCharsCursor.get()
        if (allChars == null) {
            container.destroy()
            return
        }
        if (vals(allChars).filter(c => c.health > 0).every(cm => !cm.hasMoved)) {
            // tl()
            const message = scene.get('isPlayerTurn') ? 'You start round!' : 'Enemy starts round!'
            overlay({ elementId: 'roundStart', data: { message } })
        }
        const newKeys = keys(allChars)
        if (!isEqual(lastKeys, newKeys)) {
            // tl('character keys changed!')
            console.log('difference between old keys and new keys:',
                diff(lastKeys, newKeys))
            lastKeys = newKeys
            updateScene(scene, container, move$)
        }
    })

}

function updateScene(scene: SCursor<BattleScene>, container: PixiContainer, move$: NetworkEventEmitter<'move', NetworkAttackData>) {

    const allCharsCursor = scene.select('allCharacters')
    const children = container.children
    container.removeChildren()

    for (const x of children) { x.destroy() }

    const allCharacters = allCharsCursor.get()
    const sortedYs = vals(allCharacters).map(c => c.y).sort((y1, y2) => y1 - y2)
    const childCursors = keyMap(allCharsCursor.get(), k => allCharsCursor.select(k))
    const dungeonName = scene.get('dungeonName')
    const backgroundArgs = dungeonName === 'The Matcha Caves' ?
        { src: CaveVideo } :
        { srcs: [backgrounds[dungeonName]] }
    const newChildren = [
        background({ scale: 1, ...backgroundArgs }),
        InfoBox({ info: [`Room ${scene.get('roomsPassed') + 1}`, scene.get('dungeonName')] }),
        ...childCursors.map(childCursor =>
            Character({
                cursor: childCursor,
                onClick: () => doCharacterAction({ uid: childCursor.get('uid') }),
                move$,
                scale: 1,
                isSelected: false,
                zIndex: sortedYs.findIndex(y => y === childCursor.get('y')),
            })),
        Coin(),
    ]
    for (const x of newChildren) {
        container.addChild(x)
    }
    container.sortChildren()
}

function makeDoors(parent: PixiContainer) {
    const doorCursor = getBattleScene().select('doors')
    let doorsContainer: PixiContainer | null = null
    update()
    doorCursor.on('update', update)

    function update() {
        const doors = doorCursor.get()
        console.log('doors update...')
        if ((doors == null || doors.options.length === 0) && doorsContainer != null) {
            parent.removeChild(doorsContainer)
            doorsContainer.destroy()
            doorsContainer = null
        } else if (doors != null) {
            console.log('adding some doors')
            doorsContainer = Doors({
                callbacks: doors.options.map(d => () => chooseDoor({ door: d })),
                descriptions: doors.descriptions,
                exit: () => exitDungeon(),
            })
            parent.addChild(doorsContainer)
        }

    }
}

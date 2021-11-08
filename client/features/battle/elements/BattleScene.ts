import type { CharacterMeta, NetworkAttackData, NetworkEventEmitter } from '@shared'
import { diff } from 'deep-diff'
import isEqual from 'lodash/isEqual'

import { chooseDoor, doCharacterAction, exitDungeon, startBattle } from '@/actions'
import { getBattleScene, getTree } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import { Container, overlay } from '@/elementsUtil'
import { keyMap, keys, vals } from '@/util'
import { makeClientEventListener } from '@/util/makeClientEventListener'

import CaveVideo from '../assets/backgrounds/matcha-cave.webm'
import { backgrounds } from '../logic/AssetLoader'
import background from './background'
import { NPCElm, PlayerCharacterElm } from './Character'
import Doors from './Doors'
import InfoBox from './InfoBox'


export type Move$ = NetworkEventEmitter<'move', NetworkAttackData>

export function BattleScene(): PixiContainer {
    const eventsCursor = getTree().select('events').select('move')
    const scene = getBattleScene()
    const move$ = makeClientEventListener<'move', NetworkAttackData>('move', eventsCursor)
    // const { move$, } = getBindings()

    const container = Container({ name: 'BattleScene', children: [] })

    setTimeout(startBattle, 100)

    const allCharsCursor = scene.select('allCharacters')
    let lastKeys = keys(allCharsCursor.get())
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
            renewChildren()
        }
    })


    function renewChildren() {
        console.log('renewing children')
        const ch = container.children
        container.removeChildren()
        for (const x of ch) { x.destroy() }
        const allCharacters = allCharsCursor.get()
        const sortedYs = vals(allCharacters).map(c => c.y).sort((y1, y2) => y1 - y2)
        const childCursors = keyMap(allCharacters, k => allCharsCursor.select(k))
        const dungeonName = scene.get('dungeonName')
        const backgroundArgs = dungeonName === 'The Matcha Caves' ?
            { src: CaveVideo } :
            { srcs: [backgrounds[dungeonName]] }
        const newChildren = [
            background({ scale: 1, ...backgroundArgs }),
            InfoBox({ info: [`Room ${scene.get('roomsPassed') + 1}`, scene.get('dungeonName')] }),
            ...childCursors.map((childCursor, _i) =>
                getCharacterFn(childCursor.get())({
                    cursor: childCursor,
                    onClick: () => doCharacterAction({ uid: childCursor.get('uid') }),
                    move$,
                    scale: 1,
                    isSelected: false,
                    zIndex: sortedYs.findIndex(y => y === childCursor.get().y),
                })),
        ]
        for (const x of newChildren) {
            container.addChild(x)
        }
        container.sortChildren()
    }
    renewChildren()

    setTimeout(() => makeDoors(container), 0)

    return container
}

function getCharacterFn(characterMeta: CharacterMeta) {
    if (characterMeta.isPc) return PlayerCharacterElm
    else return NPCElm
}


function makeDoors(parent: PixiContainer) {
    const doorCursor = getBattleScene().select('doors')
    let doorsCont: PixiContainer | null = null
    update()
    doorCursor.on('update', update)

    function update() {
        const doors = doorCursor.get()
        console.log('doors update...')
        if ((doors == null || doors.options.length === 0) && doorsCont != null) {
            parent.removeChild(doorsCont)
            doorsCont = null
        } else if (doors != null) {
            console.log('adding some doors')
            doorsCont = Doors({
                callbacks: doors.options.map(d => () => chooseDoor({ door: d })),
                descriptions: doors.descriptions,
                exit: () => exitDungeon({}),
            })
            parent.addChild(doorsCont)
        }

    }
}

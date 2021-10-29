import type { CharacterMeta, NetworkAttackData, NetworkEventEmitter } from '@shared'
import { diff } from 'deep-diff'
import isEqual from 'lodash/isEqual'

import { doCharacterAction, startBattle } from '@/actions'
import { getBattleScene, getTree } from '@/data/rootTree'
import type { PixiContainer } from '@/elementsUtil'
import { Container, overlay } from '@/elementsUtil'
import { keyMap, keys, vals } from '@/util'
import { makeClientEventListener } from '@/util/makeClientEventListener'

import CaveVideo from '../assets/backgrounds/matcha-cave.webm'
import { backgrounds } from '../logic/AssetLoader'
import background from './background'
import { Frogknight, Skeleton } from './Character'
import InfoBox from './InfoBox'


export type Move$ = NetworkEventEmitter<'move', NetworkAttackData>

export function BattleScene(): PixiContainer {
    const eventsCursor = getTree().select('events')
    const scene = getBattleScene()
    const move$ = makeClientEventListener<'move', NetworkAttackData>('move', eventsCursor)
    // const { move$, } = getBindings()

    const container = Container({ children: [] })

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
        const childCursors = keyMap(allCharsCursor.get(), k => allCharsCursor.select(k))
        const dungeonName = scene.get('dungeonName')
        const backgroundArgs = dungeonName === 'The Matcha Caves' ?
            { src: CaveVideo } :
            { srcs: [backgrounds[dungeonName]] }
        const newChildren = [
            background({ scale: 1, ...backgroundArgs }),
            InfoBox({ info: [`Room ${scene.get('roomsPassed') + 1}`, scene.get('dungeonName')] }),
            ...childCursors.map(childCursor =>
                getCharacterFn(childCursor.get())({
                    cursor: childCursor,
                    onClick: () => doCharacterAction({ uid: childCursor.get('uid') }),
                    move$,
                    scale: 1,
                    isSelected: false,
                })),
        ]
        for (const x of newChildren) {
            container.addChild(x)
        }
    }
    renewChildren()

    return container
}

function getCharacterFn(characterMeta: CharacterMeta) {
    if (characterMeta.isPc) return Frogknight
    else return Skeleton
}

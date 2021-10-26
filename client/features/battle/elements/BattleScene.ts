import type { CharacterMeta, NetworkAttackData, NetworkEventEmitter } from '@shared'
import { diff } from 'deep-diff'
import isEqual from 'lodash/isEqual'

import { doCharacterAction, startGame } from '@/actions'
import { getBattleScene, getTree } from '@/data/rootTree'
import { keyMap, keys, tl } from '@/util'
import { makeClientEventListener } from '@/util/makeClientEventListener'

import CaveVideo from '../assets/backgrounds/matcha-cave.webm'
import { backgrounds } from '../logic/AssetLoader'
import background from './background'
import { Frogknight, Skeleton } from './Character'
import InfoBox from './InfoBox'
import type { PixiContainer } from './mypixi'
import { Container } from './mypixi'


export type Move$ = NetworkEventEmitter<'move', NetworkAttackData>

export function BattleScene(): PixiContainer {
    const eventsCursor = getTree().select('events')
    const move$ = makeClientEventListener<'move', NetworkAttackData>('move', eventsCursor)
    // const { move$, } = getBindings()

    const container = Container({ children: [] })

    setTimeout(startGame, 100)

    const allCharsCursor = getBattleScene().select('allCharacters')
    let lastKeys = keys(allCharsCursor.get())
    allCharsCursor.on('update', function checkIfKeysChanged() {
        const allChars = allCharsCursor.get()
        if (allChars == null) {
            container.destroy()
            return
        }
        const newKeys = keys(allChars)
        if (!isEqual(lastKeys, newKeys)) {
            tl('character keys changed!')
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
        const dungeonName = getBattleScene().get('dungeonName')
        const backgroundArgs = dungeonName === 'The Matcha Caves' ?
            { src: CaveVideo } :
            { srcs: [backgrounds[dungeonName]] }
        const newChildren = [
            background({ scale: 1, ...backgroundArgs }),
            InfoBox({ info: [`Room ${getBattleScene().get('roomsPassed') + 1}`, getBattleScene().get('dungeonName')] }),
            ...childCursors.map(childCursor =>
                getCharacterFn(childCursor.get())({
                    cursor: childCursor,
                    onClick: () => doCharacterAction({ uid: childCursor.get('uid') }),
                    move$,
                    scale: 1,
                    isSelected: false,
                }))
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

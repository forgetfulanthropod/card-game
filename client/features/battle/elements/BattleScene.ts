import { doCharacterAction, startGame } from '@/actions'
import { getBattleScene, getTree } from '@/data/rootTree'
import type { CharacterMeta, CompleteAttackData } from '@/data/types'
import { keyMap, keys, tl } from '@/util'
import type { NetworkEventEmitter } from '@shared/networkEvents'
import { makeClientEventListener } from "@/util/makeClientEventListener"
import { diff } from 'deep-diff'
import isEqual from 'lodash/isEqual'
import CaveVideo from '../assets/cave_main_1.webm'
import background from './background'
import { Frogknight, Skeleton } from './Character'
import type { PixiContainer } from './mypixi'
import { Container } from './mypixi'



export type Move$ = NetworkEventEmitter<'move', CompleteAttackData>

export function BattleScene(): PixiContainer {
    const eventsCursor = getTree().select('events')
    const move$ = makeClientEventListener<'move', CompleteAttackData>('move', eventsCursor)
    // const { move$, } = getBindings()

    const container = Container({ children: [] })

    setTimeout(startGame, 100)

    const allCharsCursor = getBattleScene().select('allCharacters')
    let lastKeys = keys(allCharsCursor.get())
    allCharsCursor.on('update', function checkIfKeysChanged() {
        const newKeys = keys(allCharsCursor.get())
        if (!isEqual(lastKeys, newKeys)) {
            tl('character keys changed!')
            console.log('difference between old keys and new keys:',
                diff(lastKeys, newKeys))
            lastKeys = newKeys
            renewChildren()
        }
    })

    function renewChildren() {
        tl('renewing children')
        const ch = container.children
        container.removeChildren()
        for (const x of ch) { x.destroy() }
        const childCursors = keyMap(allCharsCursor.get(), k => allCharsCursor.select(k))
        const newChildren = [
            background({ scale: 1, src: CaveVideo }),
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

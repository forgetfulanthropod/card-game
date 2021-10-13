import { getBattleScene } from '@/data/rootTree'
import { CharacterMeta } from '@/data/types'
import { keyMap, keys, tl } from '@/util'
import CaveVideo from '../assets/cave_main_1.webm'
import { getBindings } from '@@/actions/allBattleLogic'
import background from './background'
import { Frogknight, Skeleton } from './Character'
import { Container, PixiContainer } from './mypixi'
import isEqual from 'lodash/isEqual'

export function BattleScene(): PixiContainer {
    const {
        startGame,
        // resetRound,
        // endGame,
        doCharacterAction,
        move$,
    } = getBindings()

    const container = Container({ children: [] })

    setTimeout(startGame, 100)

    const allCharsCursor = getBattleScene().select('allCharacters')
    let lastKeys = keys(allCharsCursor.get())
    allCharsCursor.on('update', function checkIfKeysChanged() {
        const newKeys = keys(allCharsCursor.get())
        if (!isEqual(lastKeys, newKeys)) {
            tl('character keys changed!')
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
                    onClick: doCharacterAction,
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

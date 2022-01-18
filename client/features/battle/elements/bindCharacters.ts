import type { BattleScene } from '@shared'
import type { SCursor } from 'baobab'
import isEqual from 'lodash/isEqual'

import { doCharacterAction } from '@/actions'
import type { PixiContainer } from '@/elementsUtil'
import { overlay } from '@/elementsUtil'
import { keyMap, keys, vals } from '@/util'

import { Character } from './Character'

export function bindCharacters(
    scene: SCursor<BattleScene>,
    container: PixiContainer
) {
    const allCharsCursor = scene.select('allCharacters')
    let lastKeys = keys(allCharsCursor.get())

    updateCharacters(scene, container)

    allCharsCursor.on('update', function checkIfKeysChanged() {
        const allChars = allCharsCursor.get()
        if (allChars == null) {
            container.destroy()
            return
        }
        if (
            vals(allChars)
                .filter(c => c.health > 0)
                .every(cm => !cm.hasMoved)
        ) {
            // tl()
            const message = scene.get('isPlayerTurn')
                ? 'You start round!'
                : 'Enemy starts round!'
            overlay({ elementId: 'roundStart', data: { message } })
        }
        const newKeys = keys(allChars)
        if (!isEqual(lastKeys, newKeys)) {
            // tl('character keys changed!')
            // console.log('difference between old keys and new keys:', diff(lastKeys, newKeys))
            lastKeys = newKeys
            updateCharacters(scene, container)
        }
    })
}

function updateCharacters(
    scene: SCursor<BattleScene>,
    container: PixiContainer
) {
    const allCharsCursor = scene.select('allCharacters')
    const children = container.children
    container.removeChildren()

    for (const x of children) {
        x.destroy()
    }

    const allCharacters = allCharsCursor.get()
    const sortedYs = vals(allCharacters)
        .map(c => c.y)
        .sort((y1, y2) => y1 - y2)
    const childCursors = keyMap(allCharsCursor.get(), k =>
        allCharsCursor.select(k)
    )
    const newChildren = [
        ...childCursors.map(childCursor =>
            Character({
                cursor: childCursor,
                onClick: () =>
                    doCharacterAction({ uid: childCursor.get('uid') }),
                scale: 1,
                isSelected: false,
                zIndex: sortedYs.findIndex(y => y === childCursor.get('y')),
            })
        ),
    ]
    for (const x of newChildren) {
        container.addChild(x)
    }
    container.sortChildren()
}

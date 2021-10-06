import EventEmitter from 'eventemitter3'
import { Frogknight, Skeleton } from './Character'
import { Container, PixiContainer } from './mypixi'

import { getBindings } from '../logic/allCharactersLogic'
import { MyCursor } from 'config/myBaobab'

export function AllCharacters(props: {
    scale: number,
    cursor: MyCursor<CharacterMeta[]>
}): PixiContainer {
    // TODO: use allCharactersLogic
    const {
        startGame,
        // resetRound,
        // endGame,
        doCharacterAction,
        move$,
    } = getBindings()

    setTimeout(startGame, 100)
    return Container({
        // name: AllCharacters.name,
        children: props.cursor.map(childCursor =>
            getCharacterFn(childCursor.get())({
                cursor: childCursor,
                onClick: doCharacterAction,
                move$,
                scale: props.scale,
                isSelected: false,
            }))
    })
}

function getCharacterFn(characterMeta: CharacterMeta) {
    if (characterMeta.isPc) return Frogknight
    else return Skeleton
}

export type MoveEmitter = EventEmitter<AttackData>
export type NpcMoveEmitter = EventEmitter<string>

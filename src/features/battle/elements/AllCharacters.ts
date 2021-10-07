import { MyCursor } from 'config/myBaobab'
import EventEmitter from 'eventemitter3'
import { getBindings } from '../logic/allCharactersLogic'
import { Frogknight, Skeleton } from './Character'
import { Container, PixiContainer } from './mypixi'


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

export type MoveEmitter = EventEmitter<''> // data: AttackData
export type NpcMoveEmitter = EventEmitter<''> // data: null

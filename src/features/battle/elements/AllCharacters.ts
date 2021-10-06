import { makeInitialPlayerCharacters } from 'data/battle/factories'
import EventEmitter from 'eventemitter3'
import { Frogknight, Skeleton } from './Character'
import { Container, PixiContainer } from './mypixi'

import { getBindings } from '../logic/allCharactersLogic'

export function AllCharacters(props: { scale: number }): PixiContainer {
    // TODO: use allCharactersLogic
    const allCharacterMeta = makeInitialPlayerCharacters()
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
        children: allCharacterMeta.map(
            characterMeta => getCharacterFn(characterMeta)({
                characterMeta,
                onClick: doCharacterAction,
                move$,
                scale: props.scale
                // isSelected: true,
                // onClick: (c: CharacterMeta) => { console.log('clicked ', c.id) },
                // move$: new EventEmitter(),
                // scale: props.scale,
            })
        )
    })
}

function getCharacterFn(characterMeta: CharacterMeta): (_) => PixiContainer {
    if (characterMeta.isPc) return Frogknight
    else return Skeleton
}

export type MoveEmitter = EventEmitter<AttackData>
export type NpcMoveEmitter = EventEmitter<string>

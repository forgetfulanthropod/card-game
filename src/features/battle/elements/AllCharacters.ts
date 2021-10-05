import { makeInitialPlayerCharacters } from 'data/battle/factories'
import EventEmitter from 'eventemitter3'
import { Frogknight } from './Character'
import { Container, PixiContainer } from './mypixi'

import { allCharactersLogic } from '../logic/allCharactersLogic'
const allCharacterMeta = makeInitialPlayerCharacters()

export function AllCharacters(props: { scale: number }): PixiContainer {
    // TODO: use allCharactersLogic
    return Container({
        name: AllCharacters.name,
        children: [
            Frogknight({
                isSelected: true,
                characterMeta: allCharacterMeta[0],
                onClick: (c: CharacterMeta) => { console.log('clicked ', c.id) },
                move$: new EventEmitter(),
                scale: props.scale,

            }),
        ]
    })
}

export type MoveEmitter = EventEmitter<AttackData>
export type NpcMoveEmitter = EventEmitter<string>

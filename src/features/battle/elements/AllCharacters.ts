import { Dispatcher } from 'data/battle/dispatch'
import { makeInitialPlayerCharacters } from 'data/battle/factories'
import { MoveEmitter } from '../components/AllCharacters'
import { Frogknight } from './Character'

const allCharacterMeta = makeInitialPlayerCharacters()

export default [Frogknight({
    isSelected: true,
    characterMeta: allCharacterMeta[0],
    onClick: (c: CharacterMeta) => null,
    dispatch: {} as Dispatcher,
    move$: {} as MoveEmitter,
    scale: 1,
})]

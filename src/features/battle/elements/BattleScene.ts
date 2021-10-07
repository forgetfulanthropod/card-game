import { getScene } from 'data/rootTree'
import { getBindings } from '../logic/allCharactersLogic'
import { Frogknight, Skeleton } from './Character'
import { Container, PixiContainer } from './mypixi'


export function BattleScene(): PixiContainer {
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
        children: getScene().select('allCharacters').map(childCursor =>
            getCharacterFn(childCursor.get())({
                cursor: childCursor,
                onClick: doCharacterAction,
                move$,
                scale: 1,
                isSelected: false,
            }))
    })
}

function getCharacterFn(characterMeta: CharacterMeta) {
    if (characterMeta.isPc) return Frogknight
    else return Skeleton
}

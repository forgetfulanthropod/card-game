import { getBindings } from '../logic/allBattleLogic'
import { Container, PixiContainer } from './mypixi'


export function DungeonEntryScene(): PixiContainer {
    // TODO: use allCharactersLogic
    const {
        startGame,
        // resetRound,
        // endGame,
        // doCharacterAction,
        // move$,
    } = getBindings()

    setTimeout(startGame, 100)
    return Container({
        // name: AllCharacters.name,
        children: []
    })
}

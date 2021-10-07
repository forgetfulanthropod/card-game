import { getBindings } from '../logic/allBattleLogic'
import background from './background'
import { Container, PixiContainer } from './mypixi'
import DungeonEntryPng from '../assets/temple_background.png'


export function DungeonEntryScene(): PixiContainer {
    // TODO: use allCharactersLogic
    // const {
    //     startGame,
    //     // resetRound,
    //     // endGame,
    //     // doCharacterAction,
    //     // move$,
    // } = getBindings()

    // setTimeout(startGame, 100)
    return Container({
        // name: AllCharacters.name,
        children: [
            background({ scale: 1, srcs: [DungeonEntryPng] }),
        ]
    })
}

import { getBattleScene } from 'data/rootTree'
import { getBindings } from '../logic/allBattleLogic'
import background from './background'
import { Frogknight, Skeleton } from './Character'
import { Container, PixiContainer } from './mypixi'
import CaveVideo from '../assets/cave_main_1.webm'


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
        children: [
            background({ scale: 1, src: CaveVideo }),
            ...getBattleScene().select('allCharacters').map(childCursor =>
                getCharacterFn(childCursor.get())({
                    cursor: childCursor,
                    onClick: doCharacterAction,
                    move$,
                    scale: 1,
                    isSelected: false,
                }))
        ]

    })
}

function getCharacterFn(characterMeta: CharacterMeta) {
    if (characterMeta.isPc) return Frogknight
    else return Skeleton
}

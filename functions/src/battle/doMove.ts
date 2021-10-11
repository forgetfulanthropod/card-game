import { getFromGameState } from '../dbwrap'
import { BattleScene } from '../../../shared/datamodel'

export default function doMove({ from }: { from: string }) {
    const scene = getFromGameState('currentScene') as BattleScene
    if (scene.name !== 'battle') {
        return { error: "Not currently in a battle" }
    }
    scene.allCharacters
    return { result: "wow" }
}

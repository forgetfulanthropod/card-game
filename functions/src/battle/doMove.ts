import { getFromGameState } from '../dbwrap'
import { BattleScene } from '../../../db/datamodel'

export default function doMove({ from }: { from: string }) {
    const scene = getFromGameState('scene') as BattleScene
    if (scene.name !== 'battle') {
        return { error: "Not currently in a battle" }
    }
    scene.allCharacters
    return { result: "wow" }
}

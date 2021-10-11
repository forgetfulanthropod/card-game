import { getFromGameState } from '../dbwrap'

export default function doMove({ from: }) {
    const scene = getFromGameState('currentScene')
    if (scene.type !== 'battle') {
        return { error: "Not currently in a battle" }
    }
    scene.characters
}

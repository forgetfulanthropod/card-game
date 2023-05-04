import { activateSouvenir as activateSouvenirImplementation } from '@/gameState/battle/activateSouvenirs'
import { getBattleSceneIn } from '@/util'
import { GameActions } from 'shared'

export const activateSouvenir: GameActions['activateSouvenir'] = args => {
    const scene = getBattleSceneIn(args.game)
    const souvenirs = scene.get('souvenirs')
    const idx = souvenirs.findIndex(s => s.id === args.souvenirId)
    const souvenir = souvenirs[idx]

    if (!souvenir || !souvenir.on.activate) return

    activateSouvenirImplementation(souvenir, 'activate', scene, idx)
}

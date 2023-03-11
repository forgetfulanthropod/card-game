import { activateSouvenir as activateSouvenirImplementation } from '@/gameState/battle/activateSouvenirs'
import { getBattleSceneIn } from '@/util'
import { GameActions } from 'shared'

export const activateSouvenir: GameActions['activateSouvenir'] = args => {
    const scene = getBattleSceneIn(args.game)
    const souvenir = scene.get('souvenirs').find(s => s.id === args.souvenirId)

    if (!souvenir || !souvenir.on.activate) return

    activateSouvenirImplementation(souvenir, 'activate', scene)
}

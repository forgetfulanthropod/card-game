import { getBattleSceneIn, isProduction } from '@/util'
import { GameActions } from 'shared'
import { acquireSouvenir } from './chooseEventResponse'

export const getFreeSouvenir: GameActions['getFreeSouvenir'] = args => {
    if (isProduction)
        return logger.info('tried to get free souvenir in production!')

    acquireSouvenir(
        args.souvenirId,
        args.characterUid,
        getBattleSceneIn(args.game)
    )
}

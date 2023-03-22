import { getBattleSceneIn, isProduction } from '@/util'
import { omit } from 'lodash'
import { GameActions } from 'shared'

export const removeCardForFree: GameActions['removeCardForFree'] = args => {
    if (isProduction)
        return logger.info('tried to remove card for free in production!')

    getBattleSceneIn(args.game)
        .select('cards', 'draw')
        .apply(cards => ({ ...omit(cards, args.uid) }))
}

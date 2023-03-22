import { getBattleSceneIn, isProduction } from '@/util'
import { omit } from 'lodash'
import { BattleCursor, Card, GameActions } from 'shared'
import { addCardToDeckPostValidation } from './addCardToDeck'

export const getFreeCard: GameActions['getFreeCard'] = args => {
    if (isProduction)
        return logger.info('tried to get free card in production!')

    const scene = getBattleSceneIn(args.game)
    addCardToDeckPostValidation(scene, args.card)

    updateUidInFullDecks(args, scene)
}

//allows multiple copies of a card
function updateUidInFullDecks(
    args: { card: Card } & {
        game: Gamecursor
        username?: string | undefined
    },
    scene: BattleCursor
) {
    const oldUid = args.card.uid
    const newUid = args.card.uid + '_'
    scene
        .select('fullSelectedCharacterDecks', args.card.characterUid)
        .apply(pile => ({
            ...omit(pile, oldUid),
            [newUid]: {
                ...pile[oldUid],
                uid: newUid,
            },
        }))
}

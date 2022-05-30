import type { GameActions } from './types'

export const addCardToDeck: GameActions['AddCardToDeck'] = args => {
    logger.info(`adding card uid: ${args.cardUid}`)
}

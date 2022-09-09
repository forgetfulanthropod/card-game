import type { BattleCursor, GameActions } from 'shared'
import { nextRoom } from './nextRoom'
import { getBattleSceneIn } from '@/util'

export const choosePlushy: GameActions['choosePlushy'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (!scene.get('isInRestSite')) return

    logger.info('TODO choose plushy ' + args.index)
    healAllPartyMembers(scene)

    scene.set('isInRestSite', false)
    nextRoom({ game: args.game })
}

function healAllPartyMembers(scene: BattleCursor) {
    logger.info('TODO choose plushy heal all party members')
}

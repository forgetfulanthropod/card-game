import type { BattleCursor, GameActions } from 'shared'
import produce from 'immer'
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
    scene.apply(
        'allCharacters',
        produce(ac => {
            for (const char of Object.values(ac)) {
                if (!char.isPc) continue
                char.health = Math.min(
                    char.constitution,
                    Math.ceil(char.health * 1.25)
                )
            }
        })
    )
    logger.info('healed all characters!')
}

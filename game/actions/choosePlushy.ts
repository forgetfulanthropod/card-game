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
    scene.set('isInMap', true)
}

function healAllPartyMembers(scene: BattleCursor) {
    scene.apply(
        'allCharacters',
        produce(ac => {
            for (const char of Object.values(ac)) {
                if (!char.isPc || char.health < 0) continue
                char.health = Math.min(
                    char.constitution,
                    Math.ceil(char.health + char.constitution * 0.25)
                )
            }
        })
    )
    logger.info('healed all characters!')
}

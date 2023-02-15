import type { BattleCursor, GameActions } from 'shared'
import produce from 'immer'
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
            Object.values(ac)
                .filter(cm => cm.isPc && cm.health > 0)
                .forEach(cm => {
                    cm.health = Math.min(
                        cm.constitution,
                        Math.ceil(cm.health + cm.constitution * 0.25)
                    )
                })
        })
    )
    logger.info('healed all characters!')
}

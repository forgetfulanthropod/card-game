import { acquireSouvenir } from '@/actions/chooseEventResponse'
import { souvenirMap } from 'shared'
import { keys, vals } from 'shared/code'
import { activateSouvenir } from './activateSouvenirs'
import { freshGameAndBattleScene, pc1 } from './interpretCommand.spec'

export const suites = {
    souvenirs: {
        allActions() {
            const { scene } = freshGameAndBattleScene()

            vals(souvenirMap).forEach(souvenir => {
                acquireSouvenir(souvenir.id, pc1, scene)
                //@ts-expect-error
                keys(souvenir.on)
                    //
                    .forEach(k => k && activateSouvenir(souvenir, k, scene))
            })
        },
    },
}

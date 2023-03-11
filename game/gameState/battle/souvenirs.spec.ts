import { acquireSouvenir } from '@/actions/chooseEventResponse'
import { souvenirMap } from 'shared'
import { keys, vals } from 'shared/code'
import { activateSouvenir } from './activateSouvenirs'
import { freshGameAndBattleScene, pc1 } from './interpretCommand.spec'

export const suites = {
    souvenirs: {
        allActions() {
            vals(souvenirMap).forEach(souvenir => {
                const { scene } = freshGameAndBattleScene()
                acquireSouvenir(souvenir.id, pc1, scene)
                //@ts-expect-error
                keys(souvenir.on)
                    //
                    .forEach(
                        k =>
                            k &&
                            k != 'acquire' &&
                            activateSouvenir(souvenir, k, scene)
                    )
            })
        },
    },
}

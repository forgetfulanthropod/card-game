import { acquireSouvenir } from '@/actions/chooseEventResponse'
import { startCase } from 'lodash'
import { evalAll, Executors, Explainers } from './util'

export const explain: Explainers['acquireSouvenir'] = dslArgs => {
    return `acquire ${startCase(dslArgs[0].eval())}`
}

export const execute: Executors['acquireSouvenir'] = ({
    dslArgs,
    command: { characterUid },
    scene,
}) => {
    const [id] = evalAll(dslArgs)
    acquireSouvenir(id, characterUid, scene)
}

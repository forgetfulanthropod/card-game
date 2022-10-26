import { startCase } from 'lodash'
import {
    getLivingNpcs,
    getLivingNpcUids,
    getLivingPcs,
    getLivingPcUids,
} from '../../characterGetters'
import { applyEffect } from './effect'
import { evalAll, evalAllAsHtml, Executors, Explainers, VAngu } from './util'

export const explain: Explainers['effect'] = dslArgs => {
    const [id, increase] = evalAllAsHtml(dslArgs)
    return `+${increase} ${startCase(id)} to enemies`
}

export const execute: Executors['effectAll'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [id, increase] = evalAll(dslArgs)
    const ac = scene.get('allCharacters')
    const targetUids = ac[command.characterUid].isPc
        ? getLivingNpcUids(scene.get())
        : getLivingPcUids(scene.get())

    // logger.info(`adding effect ${id}`)

    applyEffect(scene, targetUids, id, increase)
}

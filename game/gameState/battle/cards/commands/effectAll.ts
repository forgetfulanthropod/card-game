import { startCase } from 'lodash'
import { Command } from 'shared'
import {
    getLivingNpcs,
    getLivingNpcUids,
    getLivingPcs,
    getLivingPcUids,
} from '../../characters/characterGetters'
import { applyEffect } from './effect'
import {
    evalAll,
    evalAllAsHtml,
    Executors,
    ExplainerContext,
    Explainers,
    VAngu,
} from './util'

export const explain: Explainers['effectAll'] = (dslArgs, context) => {
    const [id, increase] = evalAllAsHtml(dslArgs)

    const friendsOrEnemies = isTargetingFriendsOrEnemies(context.command)

    return `+${increase} ${startCase(id)} to all ${friendsOrEnemies}`
}

export const execute: Executors['effectAll'] = ({
    dslArgs,
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [id, increase] = evalAll(dslArgs)
    const ac = scene.get('allCharacters')

    const npcUids = getLivingNpcUids(scene.get())
    const pcUids = getLivingPcUids(scene.get())

    const targetUids =
        ac[command.characterUid].isPc &&
        isTargetingFriendsOrEnemies(command) === 'enemies'
            ? npcUids
            : pcUids

    // logger.info(`adding effect ${id}`)

    applyEffect(scene, targetUids, id, increase)
}
function isTargetingFriendsOrEnemies(command: Command): 'friends' | 'enemies' {
    return ['friends', 'allFriends'].includes(command.targetType)
        ? 'friends'
        : 'enemies'
}

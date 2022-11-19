import { cloneDeep } from 'lodash'
import {
    BattleCursor,
    CharacterStats,
    CharacterUid,
    ModifiableStatName,
    StatModifierExpiration,
    StatModifiers,
    StatModifiersMap,
    TargetType,
} from 'shared'
import { keys } from 'shared/code'
import {
    getLivingNpcUids,
    getLivingPcUids,
} from '../../characters/characterGetters'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['modifyStat'] = dslArgs => {
    const [statName, addend, expiration, targetType] = evalAll(dslArgs)
    return `${addend >= 0 ? '+' : ''}${addend} ${statName}${
        targetType != null
            ? ' to' +
              targetType
                  .replace(/([A-Z])/g, ' $1')
                  .toLowerCase()
                  .trim()
            : ''
    } ${expiration !== 'room' ? `until end of ${expiration}` : ''}`
}

export const execute: Executors['modifyStat'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [statName, addend, expiration, targetType] = evalAll(dslArgs)

    let uids = targetUids
    switch (targetType) {
        case 'allFriends':
            uids = getLivingPcUids(scene.get())
        case 'allEnemies':
            uids = getLivingNpcUids(scene.get())
    }

    applyStatModifiers({
        scene,
        uids: targetUids,
        stats: { [statName]: addend },
        expiration,
    })
}

function applyStatModifiers({
    scene,
    uids,
    stats,
    expiration,
}: {
    scene: BattleCursor
    uids: CharacterUid[]
    stats: Partial<Pick<CharacterStats, ModifiableStatName>>
    expiration: StatModifierExpiration
}) {
    uids.map(uid =>
        scene.apply(['allCharacters', uid, 'statModifiersMap'], modifiers => {
            return getUpdatedModifiers(modifiers, stats, expiration)
        })
    )
}

function getUpdatedModifiers(
    modifiers: StatModifiersMap,
    stats: Partial<Pick<CharacterStats, ModifiableStatName>>,
    expiration: StatModifierExpiration
) {
    const updatedModifiers = {
        round: { ...modifiers.round },
        room: { ...modifiers.room },
        run: { ...modifiers.run },
    }

    //@ts-expect-error
    keys(stats).map(statKey => {
        const statModifier = stats[statKey]

        if (typeof statModifier != 'number')
            throw new Error('junk in the stat modifier')

        updatedModifiers[expiration][statKey] =
            (updatedModifiers[expiration][statKey] || 0) + statModifier
    })

    return updatedModifiers
}

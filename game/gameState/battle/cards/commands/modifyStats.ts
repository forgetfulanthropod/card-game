import { upperFirst } from 'lodash'
import {
    BasicTargetType,
    BattleCursor,
    CharacterStats,
    CharacterUid, ModifiableStatName,
    StatModifierExpiration, StatModifiersMap
} from 'shared'
import { keys } from 'shared/code'
import {
    getLivingNpcUids,
    getLivingPcUids
} from '../../characters/characterGetters'
import {
    ActionArgs,
    Anguify,
    applyStatHtml, evalAll, Executors,
    Explainers
} from './util'
import { getTargetText } from './util/getTargetText'

export const explain: Explainers['modifyStats'] = (dslArgs, context) => {
    const [statNames, addends, expiration, targetType] = getLocals(dslArgs)

    return `Give ${getTargetText(targetType, context.characterMeta)} ${statNames
        .map((_, i) => getStatModHtml(statNames[i], addends[i]))
        .join(' and ')}
    until end of ${expiration}`
}

function getStatModHtml(statName: ModifiableStatName, addend: number) {
    return `${addend >= 0 ? '+' : ''}${applyStatHtml(
        statName,
        addend.toString()
    )} <b>${upperFirst(statName)}</b>`
}

export const execute: Executors['modifyStats'] = ({
    dslArgs,
    targetUids,
    scene,
}) => {
    const [statNames, addends, expiration, targetType] = getLocals(dslArgs)
    let uids = targetUids
    switch (targetType) {
        case 'allFriends':
            uids = getLivingPcUids(scene.get())
            break
        case 'allEnemies':
            uids = getLivingNpcUids(scene.get())
            break
    }

    applyStatModifiers({
        scene,
        uids,
        stats: statNames.reduce((stats, name, i) => {
            stats[name] = addends[i]

            return stats
        }, {} as Record<ModifiableStatName, number>),
        expiration,
    })
}

function getLocals(
    dslArgs: Anguify<ActionArgs['modifyStats']>
): [
    ModifiableStatName[],
    number[],
    StatModifierExpiration,
    BasicTargetType | undefined
] {
    const [statNamesString, addendsString, expiration, targetType] =
        evalAll(dslArgs)
    const statNames = String(statNamesString).split('|') as ModifiableStatName[]
    const addends = String(addendsString)
        .split('|')
        .map(a => parseInt(a))

    return [statNames, addends, expiration, targetType]
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
    uids.forEach(uid =>
        scene.apply(['allCharacters', uid, 'statModifiersMap'], modifiers => {
            // logger.info(
            //     'should be applying these modifierss..' +
            //         JSON.stringify({ uid, stats, expiration, modifiers })
            // )
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
        turn: { ...modifiers.turn },
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

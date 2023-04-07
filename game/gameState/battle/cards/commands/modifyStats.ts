import { upperFirst } from 'lodash'
import {
    BasicTargetType,
    BattleCursor,
    CharacterStats,
    CharacterUid,
    ModifiableStatName,
    StatModifierExpiration,
    StatModifiers,
    StatModifiersMap,
} from 'shared'
import { keys } from 'shared/code'
import {
    ActionArgs,
    Anguify,
    applyStatHtml,
    evalAll,
    Executors,
    Explainers,
} from './util'
import { getTargetText } from './util/getTargetText'
import { getTargetUidsOverride } from './util/getTargetUidsOverride'

export const explain: Explainers['modifyStats'] = (dslArgs, context) => {
    const [statNames, addends, expiration, targetType] = getLocals(dslArgs)

    return `give ${getTargetText(
        targetType || context.command.targetType,
        context.characterMeta
    )} ${statNames
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
    targetUids: givenUids,
    scene,
    command,
}) => {
    const [statNames, addends, expiration, targetType] = getLocals(dslArgs)
    const uids = getTargetUidsOverride({
        targetTypeOverride: targetType,
        scene,
        command,
        givenUids,
    })

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
    stats: StatModifiers
    expiration: StatModifierExpiration
}) {
    uids.forEach(uid =>
        scene.apply(['allCharacters', uid, 'statModifiersMap'], modifiers => {
            return getUpdatedModifiers(modifiers, stats, expiration)
        })
    )
}

function getUpdatedModifiers(
    modifiers: StatModifiersMap,
    stats: StatModifiers,
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

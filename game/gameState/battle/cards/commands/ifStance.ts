import { miscTauntValues } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifStance'] = dslArgs => {
    const [stance, explanation] = evalAllAsHtml(dslArgs)
    return `You can only play this card if your character is in ${stance} stance.<br/>${explanation}`
}

export const execute: Executors['ifStance'] = ({ dslArgs, scene, command }) => {
    const stanceIdentifier = dslArgs[0].eval()
    const allStances = ['avoidant', 'neutral', 'aggressive']

    const stances = !allStances.includes(stanceIdentifier)
        ? allStances.filter(s => stanceIdentifier.includes(s))
        : [stanceIdentifier]

    const characterMeta = scene.get('allCharacters', command.characterUid)

    dslArgs[1].eval()
    if (stances.includes('aggressive')) {
        scene.apply(
            ['allCharacters', command.characterUid, 'taunt'],
            t => t + miscTauntValues['aggresive']
        )
    } else if (stances.includes('avoidant')) {
        scene.apply(
            ['allCharacters', command.characterUid, 'taunt'],
            t => t + miscTauntValues['avoidant']
        )
    }
}

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

    stances.forEach(s => {
        if (characterMeta.stance === s) dslArgs[1].eval()
    })
}

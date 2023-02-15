import type { StanceId } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifStance'] = dslArgs => {
    const [stance, explanation] = evalAllAsHtml(dslArgs)
    return `You can only play this card if your character is in ${stance} stance.<br/>${explanation}`
}

export const execute: Executors['ifStance'] = ({ dslArgs, scene, command }) => {
    const stance: StanceId = dslArgs[0].eval()

    const characterMeta = scene.get('allCharacters', command.characterUid)
    logger.info(
        `stance required is ${stance}, char stance is ${characterMeta.stance}`
    )

    if (characterMeta.stance === stance) dslArgs[1].eval()
}

import type { StanceId } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifStance'] = dslArgs => {
    const [stance, explanation1, explantion2] = evalAllAsHtml(dslArgs)
    return explantion2
        ? `${explantion2}<br/>Alternately, if in ${stance} stance, ${explanation1}`
        : `${explanation1}<br/>You can only play this card if your character is in ${stance} stance`
}

export const execute: Executors['ifStance'] = ({ dslArgs, scene, command }) => {
    const stance: StanceId = dslArgs[0].eval()

    const characterMeta = scene.get('allCharacters', command.characterUid)
    logger.info(
        `stance required is ${stance}, char stance is ${characterMeta.stance}`
    )

    if (characterMeta.stance === stance) dslArgs[1].eval()
}

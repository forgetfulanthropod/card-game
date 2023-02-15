import type { StanceId } from 'shared'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml } from './util'

export const explain: Explainers['ifStanceElse'] = dslArgs => {
    const [stance, explanation1, explantion2] = evalAllAsHtml(dslArgs)
    return `${explantion2}.<br/>Alternately, if in ${stance} stance, ${explanation1}`
}

export const execute: Executors['ifStanceElse'] = ({
    dslArgs,
    scene,
    command,
}) => {
    const stance: StanceId = dslArgs[0].eval()

    const characterMeta = scene.get('allCharacters', command.characterUid)
    logger.info(
        `stance required is ${stance}, char stance is ${characterMeta.stance}`
    )

    if (characterMeta.stance === stance) dslArgs[1].eval()
    else dslArgs[2].eval()
}

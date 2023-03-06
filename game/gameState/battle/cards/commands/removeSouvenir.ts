import produce from 'immer'
import { startCase } from 'lodash'
import { BattleCursor, CharacterUid, SouvenirId } from 'shared'
import { evalAll, Executors, Explainers } from './util'

export const explain: Explainers['removeSouvenir'] = dslArgs => {
    return `acquire ${startCase(dslArgs[0].eval())}`
}

export const execute: Executors['removeSouvenir'] = ({
    dslArgs,
    command: { characterUid },
    scene,
}) => {
    const [id] = evalAll(dslArgs)
    removeSouvenir(id, characterUid, scene)
}

function removeSouvenir(
    id: SouvenirId,
    characterUid: CharacterUid | null,
    scene: BattleCursor
) {
    let hasNotBeenRemoved = true

    //match id and equipped characterUid, only remove 1
    scene.apply('souvenirs', souvenirs =>
        souvenirs.filter(
            s =>
                !hasNotBeenRemoved ||
                (hasNotBeenRemoved =
                    s.id !== id || s.characterUid !== characterUid)
        )
    )

    if (hasNotBeenRemoved) logger.error('the souvenir has not been removed...')
}

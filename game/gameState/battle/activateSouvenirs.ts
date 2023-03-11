import {
    BattleCursor,
    CharacterUid,
    CommandId,
    Souvenir,
    SouvenirActivationKey,
} from 'shared'
import { interpretCommand } from './cards'
import { getLivingPcs } from './characters/characterGetters'
import { updateCharacters } from './characters/updateCharacters'

export function activateSouvenirs(
    activationKey: SouvenirActivationKey,
    scene: BattleCursor,
    characterUid?: CharacterUid
) {
    let wasSouvenirActivated = false

    ;(scene.get('souvenirs') ?? []).forEach(souvenir => {
        if (
            !characterUid ||
            !souvenir.equippable ||
            characterUid === souvenir.characterUid
        )
            wasSouvenirActivated = activateSouvenir(
                souvenir,
                activationKey,
                scene
            )
    })

    if (wasSouvenirActivated) logger.info(`lethal damage interrupt happening!`)

    return wasSouvenirActivated
}

export function activateSouvenir(
    souvenir: Souvenir,
    activationKey: SouvenirActivationKey,
    scene: BattleCursor
) {
    const livingPcs = getLivingPcs(scene.get())
    const commandDSLString = souvenir.on[activationKey]
    if (!commandDSLString) return false

    let characterUid = souvenir.characterUid
    if (!characterUid && souvenir.equippable)
        throw new Error(
            `equippable souvenirs must have characterUid assigned... ${souvenir.id}`
        )
    if (!characterUid) characterUid = livingPcs[0].uid

    interpretCommand({
        command: {
            id: '' as CommandId,
            name: '',
            targetNum: souvenir.targetNum ?? (souvenir.equippable ? 1 : -1),
            actions: commandDSLString,
            targetType: souvenir.equippable ? 'self' : 'allFriends',
            characterUid,
        },
        targetUids: souvenir.equippable
            ? [characterUid!]
            : livingPcs.map(cm => cm.uid),
        scene,
    })

    updateCharacters(scene)

    return true
}

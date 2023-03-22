import { randomEl } from '@/util'
import { range } from 'lodash'
import {
    BattleCursor,
    CharacterMeta,
    CharacterUid,
    CommandId,
    Souvenir,
    SouvenirActivationKey,
} from 'shared'
import { interpretCommand } from './cards'
import {
    getLivingNpcs,
    getLivingPcs,
    isPc,
} from './characters/characterGetters'
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
            (!souvenir.equippable &&
                souvenir.targetType == null &&
                isPc(scene.get(), characterUid)) ||
            ((souvenir.targetType ?? '').includes('nemies') &&
                !isPc(scene.get(), characterUid)) ||
            characterUid === souvenir.characterUid
        )
            wasSouvenirActivated =
                activateSouvenir(souvenir, activationKey, scene) ||
                wasSouvenirActivated
    })

    return wasSouvenirActivated
}

export function activateSouvenir(
    souvenir: Souvenir,
    activationKey: SouvenirActivationKey,
    scene: BattleCursor
) {
    const livingPcs = getLivingPcs(scene.get())
    const livingNpcs = getLivingNpcs(scene.get())
    const commandDSLString = souvenir.on[activationKey]
    if (!commandDSLString) return false

    let characterUid = souvenir.characterUid
    if (!characterUid && souvenir.equippable)
        throw new Error(
            `equippable souvenirs must have characterUid assigned... ${souvenir.id}`
        )
    if (!characterUid) characterUid = livingPcs[0].uid

    const targetUids = souvenir.equippable
        ? [characterUid!]
        : souvenir.targetNum && souvenir.targetType
        ? range(0, souvenir.targetNum).map(
              () =>
                  randomEl(
                      souvenir.targetType?.includes('friend')
                          ? livingPcs
                          : (livingNpcs as unknown as CharacterMeta[])
                  ).uid
          )
        : souvenir.targetType === 'allEnemies'
        ? livingNpcs.map(cm => cm.uid)
        : livingPcs.map(cm => cm.uid)

    interpretCommand({
        command: {
            id: '' as CommandId,
            name: '',
            targetNum: souvenir.targetNum ?? (souvenir.equippable ? 1 : -1),
            actions: commandDSLString,
            targetType: souvenir.equippable ? 'self' : 'allFriends',
            characterUid,
        },
        targetUids,
        scene,
    })

    updateCharacters(scene)

    return true
}

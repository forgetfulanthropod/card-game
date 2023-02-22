import {
    BattleCursor,
    CommandId,
    Souvenir,
    SouvenirActivationKey,
} from 'shared'
import { interpretCommand } from './cards'
import { getLivingPcs } from './characters/characterGetters'

export function activateSouvenirs(
    activationKey: SouvenirActivationKey,
    scene: BattleCursor
) {
    scene.get('souvenirs').forEach(souvenir => {
        activateSouvenir(souvenir, activationKey, scene)
    })
}

export function activateSouvenir(
    souvenir: Souvenir,
    activationKey: SouvenirActivationKey,
    scene: BattleCursor
) {
    const livingPcs = getLivingPcs(scene.get())
    const commandDSLString = souvenir.on[activationKey]
    if (!commandDSLString) return

    const characterUid = souvenir.characterUid || livingPcs[0].uid

    interpretCommand({
        command: {
            id: '' as CommandId,
            name: '',
            targetNum: souvenir.equippable ? 1 : -1,
            actions: commandDSLString,
            targetType: souvenir.equippable ? 'self' : 'allFriends',
            characterUid,
        },
        targetUids: souvenir.equippable
            ? [characterUid]
            : livingPcs.map(cm => cm.uid),
        scene,
    })
}

import { BattleCursor, SouvenirActivationKey } from 'shared'
import { interpretCommand } from './cards'

export function activateSouvenirs(
    activationKey: SouvenirActivationKey,
    scene: BattleCursor
) {
    // scene.get('souvenirs').forEach(souvenir => {
    //     const commandDSLString = souvenir.on[activationKey]
    //     if (commandDSLString) {
    //         interpretCommand({
    //             command: {
    //                 actions: commandDSLString,
    //                 targetType: ''
    //             }
    //         })
    //     }
    // })
}

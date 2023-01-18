import { startCase, upperFirst } from 'lodash'
import { BasicTargetType, CharacterMeta } from 'shared'

export function getTargetText(
    targetType: BasicTargetType | undefined,
    cm: CharacterMeta
) {
    return ` ${
        targetType == null
            ? 'target Kaiju'
            : targetType === 'allFriends'
            ? 'all friendly Kaiju'
            : targetType === 'allEnemies'
            ? 'all enemy Kaiju'
            : targetType === 'enemies'
            ? 'target Kaiju'
            : targetType === 'friends'
            ? 'friendly Kaiju'
            : targetType === 'self'
            ? `this <br/>${upperFirst(startCase(cm.id))}`
            : ''
    }`
}

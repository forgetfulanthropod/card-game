import { startCase, upperFirst } from 'lodash'
import { BasicTargetType, CharacterMeta } from 'shared'

export function getTargetText(
    targetType: BasicTargetType | undefined,
    cm: CharacterMeta
) {
    return ` ${
        targetType == null
            ? 'Target Kaiju'
            : targetType === 'allFriends'
            ? 'All friendly Kaiju'
            : targetType === 'allEnemies'
            ? 'Every enemy'
            : targetType === 'enemies'
            ? 'Enemy target'
            : targetType === 'friends'
            ? 'Target Kaiju'
            : targetType === 'self'
            ? `This <br/>${upperFirst(startCase(cm.id))}`
            : ''
    }`
}

import { startCase, upperFirst } from 'lodash'
import { BasicTargetType, CharacterMeta } from 'shared'

export function getTargetText(
    targetType: BasicTargetType | undefined,
    cm: CharacterMeta
) {
    return `${
        targetType == null
            ? 'target Kaiju'
            : targetType === 'allFriends'
            ? 'every friendly Kaiju'
            : targetType === 'allEnemies'
            ? 'every enemy'
            : targetType === 'enemies'
            ? 'enemy target'
            : targetType === 'friends'
            ? 'target Kaiju'
            : targetType === 'self'
            ? `${cm.displayName.split(' ')[0]}`
            : ''
    }`
}

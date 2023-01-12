import { BasicTargetType } from 'shared'

export function getTargetText(targetType: BasicTargetType | undefined) {
    return ` ${
        targetType == null
            ? 'target'
            : targetType === 'allFriends'
            ? 'all friendly'
            : targetType === 'allEnemies'
            ? 'all enemy'
            : targetType === 'enemies'
            ? 'target'
            : ''
    } Kaiju`
}

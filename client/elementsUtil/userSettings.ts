import { toString } from 'lodash'

type UserSettingsInLocalStorage =
    | 'muteSFX'
    | 'muteMusic'
    | 'isHighResolution'
    | 'enableMotionFX'

export const getBooleanFromLocalStorage = (key: UserSettingsInLocalStorage) => {
    const value = !!(localStorage.getItem(key) === 'true')
    localStorage.setItem(key, value ? 'true' : 'false')
    return value
}

export const toggleBooleanInLocalStorage = (
    key: UserSettingsInLocalStorage
) => {
    const prevValue = getBooleanFromLocalStorage(key)
    const newValue = !prevValue
    localStorage.setItem(key, toString(newValue))
}

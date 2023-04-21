import { random, toString } from 'lodash'
import { WalletAddress } from 'shared'

type BooleanKeyInLocalStorage =
    | 'muteSFX'
    | 'muteMusic'
    | 'isHighResolution'
    | 'enableMotionFX'
    | 'isFrameRateCapped'

type BooleanValueInLocalStorage = { [k in BooleanKeyInLocalStorage]: boolean }

type StringKeyInLocalStorage = 'authToken' | 'username' | 'walletAddress'

type StringValueInLocalStorage = {
    'authToken': string;
    'username': string;
    'walletAddress': WalletAddress
}

type ValueInLocalStorage = BooleanKeyInLocalStorage | StringKeyInLocalStorage

export const getBooleanFromLocalStorage = <K extends BooleanKeyInLocalStorage>(
    key: K
): BooleanValueInLocalStorage[K] => {
    const value = !!(localStorage.getItem(key) === 'true')
    localStorage.setItem(key, value ? 'true' : 'false')
    return value
}

export const toggleBooleanInLocalStorage = (key: BooleanKeyInLocalStorage) => {
    const prevValue = getBooleanFromLocalStorage(key)
    const newValue = !prevValue
    localStorage.setItem(key, toString(newValue))
}

export const getStringFromLocalStorage = <K extends StringKeyInLocalStorage> (key: K): StringValueInLocalStorage[K] => {
    const valueInLocalStorage = localStorage.getItem(key) as StringValueInLocalStorage[K]
    return valueInLocalStorage
}

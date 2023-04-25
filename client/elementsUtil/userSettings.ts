import { random, toString } from 'lodash'
import { AuthToken, RequireAllKeys, WalletAddress } from 'shared'

type BooleanKeyInLocalStorage =
    | 'muteSFX'
    | 'muteMusic'
    | 'isHighResolution'
    | 'enableMotionFX'
    | 'isFrameRateCapped'

type BooleanValueInLocalStorage = { [k in BooleanKeyInLocalStorage]: boolean }

type StringKeyInLocalStorage = 'authToken' | 'userId' | 'walletAddress'

type StringValueInLocalStorage = RequireAllKeys<
    {
        authToken: AuthToken
        userId: string
        walletAddress: WalletAddress
    },
    StringKeyInLocalStorage
>

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

export const getStringFromLocalStorage = <K extends StringKeyInLocalStorage>(
    key: K
): StringValueInLocalStorage[K] => {
    const valueInLocalStorage = localStorage.getItem(
        key
    ) as StringValueInLocalStorage[K]
    return valueInLocalStorage
}

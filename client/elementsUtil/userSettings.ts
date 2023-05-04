import { random, toString } from 'lodash'
import { AuthToken, Nonce, RequireAllKeys, UserID, WalletAddress } from 'shared'

type BooleanKeyInLocalStorage =
    | 'muteSFX'
    | 'muteMusic'
    | 'isHighResolution'
    | 'enableMotionFX'
    | 'isFrameRateCapped'

type BooleanValueInLocalStorage = { [k in BooleanKeyInLocalStorage]: boolean }

type StringKeyInLocalStorage =
    | 'authToken'
    | 'userId'
    | 'walletAddress'
    | 'nonce'

type StringValueInLocalStorage = RequireAllKeys<
    {
        authToken: AuthToken
        userId: UserID | null
        walletAddress: WalletAddress
        nonce: Nonce
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

export const getStringFromLocalStorage = <K extends StringKeyInLocalStorage[]>(
    ...keys: K
): { [P in K[number]]: StringValueInLocalStorage[P] } => {
    const valuesInLocalStorage = keys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: localStorage.getItem(
                key
            ) as StringValueInLocalStorage[typeof key],
        }),
        {} as { [P in K[number]]: StringValueInLocalStorage[P] }
    )

    return valuesInLocalStorage
}

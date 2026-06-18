import {
    ServerActions,
    MIN_USERNAME_LENGTH,
    MAX_USERNAME_LENGTH,
} from 'shared'
import Filter from 'bad-words'
import { toLower } from 'lodash'
import { updateUsername, usernameExists } from '@/storage'

export const setUsername: ServerActions['setUsername'] = async ({
    userId,
    username,
}) => {
    username = toLower(username)
    logger.info(`${userId} is trying to set username to: ${username}`)

    if (!usernameIsValid(username)) {
        return { result: 'failure' }
    }

    if (usernameIsValid(username) && !usernameExists(username)) {
        const ok = updateUsername(userId, username)
        return { result: ok ? 'success' : 'failure' }
    }

    return { result: 'failure' }
}

const usernameIsValid = (username: string): boolean => {
    const filter = new Filter()

    if (
        username.length < MIN_USERNAME_LENGTH ||
        username.length > MAX_USERNAME_LENGTH
    ) {
        return false
    } else if (filter.isProfane(username)) {
        return false
    } else if (username.indexOf(' ') >= 0 ) {
        return false
    }

    return true
}

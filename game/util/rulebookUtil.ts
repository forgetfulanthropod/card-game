import { existsSync, mkdirSync, readdirSync } from 'fs'
import { difference } from 'lodash'
import { homedir } from 'os'
import type { Gamestate, Rulebook } from 'shared'

import { getRulebook } from '@/rulebook'

export const prefix = homedir() + '/rulebooks/'
export const toPath = (id: string): string => prefix + id + '.json'
const removeExtension = (filename: string): string =>
    filename.replace(/\.[^/.]+$/, '')

export function updateClientRulebookData(username: string): void {
    // Q: Update all users or just one?
    const rulebookNames = getRulebookNames()
    const curRulebook = stringifyRulebook(getRulebook())
    /*
    const users = getRootCursor().select('users')
    const usernames = Object.keys(users.get())
    for (const username of usernames) {
        const user = users.select(username)
        user.select('rulebooks').set(rulebookNames)
        user.select('curRulebook').set(curRulebook)
    }
    commit(getGameStateCursor(username), username)
    */
}

export function getRulebookNames(): Gamestate['rulebooks'] {
    if (!existsSync(prefix)) {
        mkdirSync(prefix)
    }
    const filenames = readdirSync(prefix)
    const names = filenames.map(fn => removeExtension(fn))
    return [...names, 'default']
}

/** put at the top */
const keyOrder = ['name', 'version', 'savedAt']

/** Ensures consistent key ordering which is good for diffs */
export function stringifyRulebook(rb: Rulebook): string {
    const allKeys: string[] = []
    const seen = new Set<string>()
    JSON.stringify(rb, function (key, value) {
        if (!seen.has(key)) {
            allKeys.push(key)
            seen.add(key)
        }
        return value
    })
    allKeys.sort()
    const final = [...keyOrder, ...difference(allKeys, keyOrder)]
    return JSON.stringify(rb, final, 4)
}

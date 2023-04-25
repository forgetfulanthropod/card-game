import { existsSync, mkdirSync, readdirSync } from 'fs'
import { homedir } from 'os'
import { difference } from 'lodash'
import type { GameState, Rulebook } from 'shared'

export const prefix = homedir() + '/rulebooks/'
export const toPath = (id: string): string => prefix + id + '.json'
const removeExtension = (filename: string): string =>
    filename.replace(/\.[^/.]+$/, '')

export function updateClientRulebookData(userId: string): void {
    // Q: Update all users or just one?
    /*
    const rulebookNames = getRulebookNames()
    const curRulebook = stringifyRulebook(getRulebook())
    const users = getRootCursor().select('users')
    const userIds = Object.keys(users.get())
    for (const userIds of userIds) {
        const user = users.select(userId)
        user.select('rulebooks').set(rulebookNames)
        user.select('curRulebook').set(curRulebook)
    }
    commit(getGameStateCursor(userId), userId)
    */
}

export function getRulebookNames(): GameState['rulebooks'] {
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

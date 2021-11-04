import type { Gamestate, Rulebook } from '@shared'
import { readdirSync } from 'fs'
import { difference } from 'lodash'
import { homedir } from 'os'

import { getRulebook } from '@/rulebook'

import { commit, getRootCursor } from '.'

export const prefix = homedir() + '/rulebooks/'
export const toPath = (id: string): string => prefix + id + '.json'
const removeExtension = (filename: string): string => filename.replace(/\.[^/.]+$/, '')

export function updateRulebookNames(): void {
    const cursor = getRootCursor().select('users').select('alice').select('rulebooks')
    cursor.set(getRulebookNames())
    commit(cursor)
}

export function updateClientRulebook(): void {
    const cursor = getRootCursor().select('users').select('alice').select('curRulebook')
    cursor.set(stringifyRulebook(getRulebook()))
    commit(cursor)
}

export function getRulebookNames(): Gamestate['rulebooks'] {
    const filenames = readdirSync(prefix)
    const names = filenames.map(fn => removeExtension(fn))
    return [...names, 'default']
}


/** put at the top */
const keyOrder = [
    'name',
    'version',
    'savedAt',
]

/** Ensures consistent key ordering which is good for diffs */
export function stringifyRulebook(rb: Rulebook): string {
    const allKeys: string[] = []
    const seen = new Set<string>()
    JSON.stringify(rb, function (key, value) {
        if (!(seen.has(key))) {
            allKeys.push(key)
            seen.add(key)
        }
        return value
    })
    allKeys.sort()
    const final = [...keyOrder, ...difference(allKeys, keyOrder)]
    return JSON.stringify(rb, final, 4)
}

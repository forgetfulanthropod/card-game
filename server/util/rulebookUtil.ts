import type { Gamestate, Rulebook } from '@shared'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { homedir } from 'os'

import { getRulebook } from '@/rulebook'

import { commit, getRootCursor } from '.'

export const prefix = homedir() + '/rulebooks/'
export const toPath = (id: string): string => prefix + id + '.json'
const removeExtension = (filename: string): string => filename.replace(/\.[^/.]+$/, '')

export function updateRulebookNames(): void {
    const cursor = getRootCursor().select('users').select('alice').select('rulebooks')
    cursor.set(getRulebookPairs())
    commit(cursor)
}

export function updateClientRulebook(): void {
    const cursor = getRootCursor().select('users').select('alice').select('curRulebook')
    cursor.set(getRulebook())
    commit(cursor)
}

export function getRulebookPairs(): Gamestate['rulebooks'] {
    const things = [{ name: 'default', id: 'default' }]
    if (!existsSync(prefix)) {
        return things
    }
    // TODO: put the name and the id together in the filename
    const filenames = readdirSync(prefix)
    for (const filename of filenames) {
        const s: string = readFileSync(prefix + filename, 'utf8')
        const json = JSON.parse(s) as Rulebook
        things.push({ name: json.name, id: removeExtension(filename) })
    }
    return things
}

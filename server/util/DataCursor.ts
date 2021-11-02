import type { Gamestate } from '@shared'
import type { SCursor } from 'baobab'
import { SBaobab } from 'baobab'
import { memoize } from 'lodash'

import { getIo } from '@/index'

import type { RootTreeShit } from './treeAccessors'
import { getRootCursor } from './treeAccessors'

export function commit(cursor: { get: () => unknown }, customName?: string, justSub = false): void {
    // TODO eventually: just commit Sub probably or maybe commit changes (diff)
    logger.info('committing')
    if (customName != null) { logger.info('committing to event name ', customName, 'and justSub is', justSub) }
    if (justSub) {
        getIo().emit(customName ?? 'update', cursor.get())
        return
    }
    getIo().emit(customName ?? 'update', getRootCursor().select('users').select('alice').get())
}

export const makeRootDataCursor = memoize(function makeRootDataCursor(): SCursor<RootTreeShit> {
    const b = new SBaobab({
        contents: {
            users: {
                alice: null as unknown as Gamestate,

            },
            testCounters: { counter0: 0 },
        },
    })
    return b.select('contents')
})

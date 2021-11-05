
import type { IncrementTestCounter } from '@shared'

import { commit, getRootCursor } from '@/util'

export const incrementTestCounter: IncrementTestCounter = () => {
    const doc = getRootCursor().select('testCounters').select('counter0')
    doc.apply(x => x + 1)
    commit(doc, 'counterChange', true)
}

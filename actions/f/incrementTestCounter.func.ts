
import { getRootCursor } from '../util/getters'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async function incrementTestCounter() {
    const doc = getRootCursor().select('testCounters').select('counter0')
    doc.apply(x => x + 1)
})

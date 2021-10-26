
import { getRootCursor, onCallWrapper } from '@/util'

export default onCallWrapper(function incrementTestCounter() {
    const doc = getRootCursor().select('testCounters').select('counter0')
    doc.apply(x => x + 1)
    doc.commit('counterChange', true)
})

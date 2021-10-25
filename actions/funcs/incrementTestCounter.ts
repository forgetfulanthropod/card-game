
import { onCallWrapper } from '../util/onCallWrapper'
import { getRootCursor } from '../util/treeAccessors'

export default onCallWrapper(function incrementTestCounter() {
    const doc = getRootCursor().select('testCounters').select('counter0')
    doc.apply(x => x + 1)
    doc.commit('counterChange', true)
})

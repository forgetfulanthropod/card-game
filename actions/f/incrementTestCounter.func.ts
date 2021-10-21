
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async () => {
    const doc = datastore().collection('testCounters').doc('counter0')
    const prev = (await doc.get()).data()?.count ?? 0
    await doc.set({ count: prev + 1 })
}
)

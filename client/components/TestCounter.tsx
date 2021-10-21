import { doc, onSnapshot } from 'firebase/firestore'
import type { JSX } from 'preact'
import { h } from 'preact' // eslint-disable-line unused-imports/no-unused-imports
import { useEffect, useRef } from 'preact/hooks'

import { incrementTestCounter } from '@/actions'
import { maybeInitializeApp } from '@/fire'
export default function TestCounter(): JSX.Element {
    const start = useRef(0)
    useEffect(() => {
        const { db } = maybeInitializeApp()
        console.log('attaching test counter listener')
        const unsub = onSnapshot(doc(db, 'testCounters', 'counter0'), doc =>
            console.log('doc is', doc.data(), (Date.now() - start.current) / 1000, 'seconds after button press'))
        return unsub
    }, [])

    return <button
        style={{ pointerEvents: 'auto' }}
        onClick={async () => {
            start.current = Date.now()
            console.log('making request to incrementTestCounter')
            await incrementTestCounter({})
            console.log('request returned after', (Date.now() - start.current) / 1000, 'seconds after button press')
        }}>
        Increment test thing</button>
}

import { useEffect, useRef } from 'preact/hooks'

import { callApi } from '@/actions'

export function TestCounter(): JSXElement {
    const start = useRef(0)
    useEffect(() => {
        console.log('attaching test counter listener')
        const onChange = (data: unknown) => {
            console.log(
                'counter data changed to',
                data,
                (Date.now() - start.current) / 1000,
                'seconds after button press'
            )
        }
    }, [])

    return <button
        style={{ pointerEvents: 'auto' }}
        onClick={async () => {
            start.current = Date.now()
            console.log('making request to incrementTestCounter')
            await callApi('IncrementTestCounter', {})
            console.log(
                'request returned after',
                (Date.now() - start.current) / 1000,
                'seconds after button press'
            )
        }}
    >
        Increment test thing
    </button>
}

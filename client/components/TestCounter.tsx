import { useRef } from 'preact/hooks'

import { callApi } from '@/callApi'

export function TestCounter(): JSXElement {
    const start = useRef(0)

    return <button
        style={{ pointerEvents: 'auto' }}
        onClick={async () => {
            start.current = Date.now()
            console.log('making request to incrementTestCounter')
            await callApi('incrementTestCounter', {})
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

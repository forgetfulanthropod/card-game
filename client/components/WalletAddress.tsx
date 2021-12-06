import { h, JSX } from 'preact' // eslint-disable-line
//@ts-ignore
import styled from 'styled-components'

import { makeNewUser } from '@/actions'
import { useRef } from 'preact/hooks'


const Root = styled.div`
    position: absolute;
    right: 50%;
    bottom: 10px;
    pointer-events: auto;
`

export default function WalletAddress(): JSX.Element {
    const ref = useRef<HTMLInputElement | null>(null)
    return <Root>
        <input ref={ref}></input>
        <button onClick={() => alert(ref.current?.value)}>Go</button>
    </Root>
}

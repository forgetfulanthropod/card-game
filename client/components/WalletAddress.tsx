import { h, JSX } from 'preact' // eslint-disable-line
//@ts-ignore
import styled from 'styled-components'

import { claimLoot } from '@/actions'
import { useRef } from 'preact/hooks'
import { jss, tl } from '@/util'

const Root = styled.div`
    position: absolute;
    right: 50%;
    bottom: 10px;
    pointer-events: auto;
`

export default function WalletAddress(): JSX.Element {
    const ref = useRef<HTMLInputElement>(null)
    return (
        <Root>
            <input ref={ref}></input>
            <button
                onClick={async () => {
                    tl('attempting to claim loot...')
                    if (ref.current?.value == null) throw Error('null address')
                    const res = await claimLoot({
                        walletAddress: ref.current?.value,
                    })
                    tl(jss`server wallet response: ${res}`)
                }}
            >
                Claim Tokens
            </button>
        </Root>
    )
}

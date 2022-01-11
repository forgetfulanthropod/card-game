import { useRef } from 'preact/hooks'

import { claimLoot } from '@/actions'
import styled from '@/config/mystyled'
import { jss, tl } from '@/util'

const Root = styled.div`
    position: absolute;
    right: 50%;
    bottom: 10px;
    pointer-events: auto;
`

export default function WalletAddress(): JSXElement {
    const ref = useRef<HTMLInputElement>(null)
    return <Root>
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
}

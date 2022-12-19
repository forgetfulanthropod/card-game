import { callApi } from '@/callApi'
import { styled } from '@/config'

const Root = styled.button`
    position: absolute;
    right: 5px;
    top: 10px;
    pointer-events: auto;
    border: none;
    background: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
`

export function ResetButton(props: { username: string }): JSXElement {
    let release = false
    return <Root
        onPointerDown={() => {
            release = false
            setTimeout(async () => {
                if (!release) {
                    // localStorage.removeItem('username')
                    await callApi('makeNewUser', { username: props.username })
                    window.location.reload()
                }
            }, 2500)
        }}
        onPointerUp={async () => {
            release = true
            window.location.reload()
            // location.replace(
            //     window.location.href.replace('#continue', '') + '#continue'
            // )
        }}
    >
        ↺
    </Root>
}

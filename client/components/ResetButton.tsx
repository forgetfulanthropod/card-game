import { callApi } from '@/actions'
import { styled } from '@/config'

const Root = styled.button`
    position: absolute;
    right: 5px;
    bottom: 10px;
    pointer-events: auto;
    border: none;
    background: none;
    color: white;
    font-size: 40px;
    cursor: pointer;
`

export function ResetButton(props: { username: string }): JSXElement {
    let release = false
    return <Root
        onPointerDown={() => {
            setTimeout(() => {
                if (!release) {
                    localStorage.removeItem('username')
                    window.location.reload()
                }
            }, 2500)
        }}
        onPointerUp={async () => {
            release = true
            await callApi('makeNewUser', { username: props.username })
        }}
    >
        ↺
    </Root>
}

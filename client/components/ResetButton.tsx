import { makeNewUser } from '@/actions'
import styled from '@/config/mystyled'

const Root = styled.button`
    position: absolute;
    right: 10px;
    bottom: 10px;
    pointer-events: auto;
`

export default function ResetButton(props: { username: string }): JSXElement {
    return <Root onClick={() => makeNewUser({ username: props.username })}>
        reset everything
    </Root>
}

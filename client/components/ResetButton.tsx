import { callApi } from '@/actions'
import styled from '@/config/mystyled'

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

export default function ResetButton(props: { username: string }): JSXElement {
    return <Root
        onClick={() => callApi('MakeNewUser', { username: props.username })}
    >
        ↺
    </Root>
}

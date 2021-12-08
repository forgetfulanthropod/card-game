import { h, JSX } from 'preact' // eslint-disable-line
//@ts-ignore
import styled from 'styled-components'

import { makeNewUser } from '@/actions'

const Root = styled.button`
    position: absolute;
    right: 10px;
    bottom: 10px;
    pointer-events: auto;
`

export default function ResetButton(props: { username: string }): JSX.Element {
    return <Root onClick={() => makeNewUser({ username: props.username })}>reset everything</Root>
}

import { changeScene } from '@@/logic/functions'
import { h, JSX } from 'preact'
//@ts-ignore
import styled from 'styled-components'

const Root = styled.button`
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
`

export default function StartButton(): JSX.Element {
    return <Root onClick={() => changeScene('battle')}>start</Root>
}

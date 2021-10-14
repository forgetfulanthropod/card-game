import type { JSX } from 'preact'
import { h } from 'preact'
//@ts-ignore
import styled from 'styled-components'

import { changeScene } from '@/actions'

const Root = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 80px;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
`

export default function StartButton(): JSX.Element {
    return <Root onClick={() => changeScene('battle')}>start</Root>
}

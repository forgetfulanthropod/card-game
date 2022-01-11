import { changeScene } from '@/actions'
import styled from '@/config/mystyled'

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

export default function StartButton(): JSXElement {
    return <Root onClick={() => changeScene({ newSceneName: 'battle' })}>
        start
    </Root>
}

import { h, JSX } from 'preact' // eslint-disable-line
//@ts-expect-error
import styled from 'styled-components'

const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

export default function AppWrap(props: { children: Children }): JSX.Element {
    return <Relative>
        {props.children}
    </Relative>
}

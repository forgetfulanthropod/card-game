import styled from '@/config/mystyled'

const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 1.3vw;
`

export default function AppWrap(props: { children: Children }): JSXElement {
    return <Relative>{props.children}</Relative>
}

import React from "react"
import styled from "styled-components"

const Root = styled.div`
    width: 100vw;
    height: 56.25vw; // 1080/1920
    max-height: 100vh;
    max-width: 177.78vh; // 1920/1080
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`

const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

export default function AppWrap(props: { children: Children }): JSX.Element {
    return <Root>
        <Relative>
            {props.children}
        </Relative>
    </Root>
}

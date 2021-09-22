import React from "react"
import styled from "styled-components"
import Cave from './assets/cave_main_1.mp4'

const Root = styled.video`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
`


export default function Background(): JSX.Element {
    return <>
        {/* <Span>Hello</Span> */}
        <Root autoPlay muted loop>
            <source src={Cave} type="video/mp4" />
        </Root>
    </>
}

// const Span = styled.span`
//     position: absolute;
//     left: 25%;
//     top: 25%;
//     width: 10%;
//     height: 10%;
//     background: orange;
//     font-size: 5vw;
// `

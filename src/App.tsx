import React from "react"
import { Toaster } from "react-hot-toast"
import Fighter from "./Fighter"
import styled from "styled-components"

const AppDiv = styled.div`
    width: 100vw;
    height: 56.25vw;
    max-height: 100vh;
    max-width: 177.78vh;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid red;
`

export default function App(): JSX.Element {
    return <AppDiv>
        <Toaster />
        <h2>Hello, world</h2>
        <Fighter />
    </AppDiv>
}

import React from "react"
import { Toaster } from "react-hot-toast"
import AllCharacters from "./AllCharacters"
import AppWrap from "./AppWrap"
import Background from "./Background"


export default function App(): JSX.Element {
    return <AppWrap>
        <Background />
        <Toaster />
        <AllCharacters />
    </AppWrap>
}

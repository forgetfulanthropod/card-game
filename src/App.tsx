import React from "react"
import { Toaster } from "react-hot-toast"
import Fighter from "./Fighter"
import AppWrap from "./AppWrap"
import Background from "./Background"


export default function App(): JSX.Element {
    return <AppWrap>
        <Background />
        <Toaster />
        <Fighter />
    </AppWrap>
}

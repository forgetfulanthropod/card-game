import React from "react"
import { Toaster } from "react-hot-toast"
import Fighter from "./Fighter"
import './App.css'

export default function App(): JSX.Element {
    return <div>
        <Toaster />
        <h2>Hello, world</h2>
        <Fighter />
    </div>
}
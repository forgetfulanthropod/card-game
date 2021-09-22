import React from "react"
import { Toaster } from "react-hot-toast"
import Fighter from "./Fighter"
import styles from './App.module.css'
export default function App(): JSX.Element {
    return <div className={styles.app}>
        <Toaster />
        <h2>Hello, world</h2>
        <Fighter />
    </div>
}

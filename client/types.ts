import type { ComponentChildren, JSX } from 'preact'
import type { StateUpdater } from 'preact/hooks'

// const o : {x: typeof JSX} = {x: Preact.JSX}
// type JSX = typeof Preact.JSX
declare global {
    // type JSXElement = PJSXElement
    /** Maybe type */
    type Mb<T> = T | null | undefined
    type Children = ComponentChildren
    type Callback = () => void
    type Setter<T> = StateUpdater<T | undefined>

    type Size = {
        width: number
        height: number
    }
    type SizeQ = {
        width?: number
        height?: number
    }
    type JSXElement = JSX.Element
    type Point = { x: number; y: number }
}

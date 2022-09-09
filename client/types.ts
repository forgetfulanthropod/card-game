import type { ComponentChildren, JSX } from 'preact'
import type { StateUpdater } from 'preact/hooks'
import type { ROCursor } from 'sbaobab'
import type { BattleScene } from 'shared'

// const o : {x: typeof JSX} = {x: Preact.JSX}
// type JSX = typeof Preact.JSX
declare global {
    // type JSXElement = PJSXElement
    /** Maybe type */
    type Mb<T> = T | null | undefined
    type Children = ComponentChildren
    type Callback = () => void
    type Setter<T> = StateUpdater<T | undefined>
    type Empty = Record<string, never>
    type Rect = [left: number, top: number, width: number, height: number]

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
    type Unbind = () => void
    type ROBattleScene = ROCursor<BattleScene>
    // eslint-disable-next-line no-var
    var process: { env: { [key: string]: string } }
}


import type Preact from 'preact'
// import Preact, {JSX} from 'preact'
import type { StateUpdater } from 'preact/hooks'


// const o : {x: typeof JSX} = {x: Preact.JSX}
// type JSX = typeof Preact.JSX

declare global {
    // type JSX.Element = PJSX.Element
    type Children = Preact.JSX.Element | null | false | Children[]
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
    type EmptyObject = Record<string, never>
}


import EventEmitter from 'eventemitter3'
import Preact from 'preact'
// import Preact, {JSX} from 'preact'
import { StateUpdater } from 'preact/hooks'
import { AttackData } from './data/types'

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

export default null

export type MoveEmitter = EventEmitter<{ '': AttackData }>
export type NpcMoveEmitter = EventEmitter<{ '': string }>

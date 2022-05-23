import { omit } from 'lodash'
import { useRef, useState } from 'preact/hooks'
import toast from 'react-hot-toast'
import type { ROCursor } from 'sbaobab'
import type { Gamestate } from 'shared'

import type { MonacoRef } from './Monaco'
import { Monaco } from './Monaco'
import { useCursor } from './util'
import { styled } from '@/config'
import { getClientTree, getTree } from '@/data'

export function Sidebar(): JSXElement {
    return <div style={{ pointerEvents: 'auto' }}>
        <OneSidebar
            cursor={getTree().select('events').select('damage$')}
            title='Event History'
            top='0'
        />
        <OneSidebar
            cursor={
                // @ts-ignore
                getClientTree().select('serverCalls')
            }
            title='Server calls'
            top='1em'
        />
        <GamestateEditor top='2em' />
    </div>
}

function GamestateEditor(props: { top: string }): JSXElement {
    // const [data, setData] = useState(getTree().get())
    // getTree().on('update', () => { setData(getTree().get()) })

    const ref: MonacoRef = useRef(null)
    const data = useCursor(getTree().select())

    const [shown, setShown] = useState(false)
    const title = 'Edit gamestate tree'
    return <Root shown={shown} top={props.top} styleChildren={false}>
        <span onClick={() => setShown(s => !s)}>
            {shown ? <b>{title}</b> : title}
        </span>
        {shown && <Monaco
            mref={ref}
            defaultValue={JSON.stringify(
                omit(data, ['curRulebook', 'rulebooks']),
                null,
                4
            )}
            onClose={() => {
                if (ref.current == null) return
                const curString = ref.current.getValue()
                let parsed = null
                try {
                    parsed = JSON.parse(curString) as Partial<Gamestate>
                } catch (e) {
                    toast.error('json parse error')
                    return
                }
                // @ts-expect-error
                getTree().merge(parsed)
                setShown(false)
            }}
        />}
        {/* onChange={(data: JSONEditData) => {
                    getTree().set(data.jsObject as Gamestate)
                }} */}
    </Root>
}

function OneSidebar<T>(props: {
    cursor: ROCursor<T[]>
    title: string
    top: string
}): JSXElement {
    const c = props.cursor
    const [shown, setShown] = useState(false)
    const [events, setEvents] = useState(c.get())
    c.on('update', () => setEvents(c.get()))
    return <Root shown={shown} top={props.top} styleChildren={true}>
        <span onClick={() => setShown(s => !s)}>
            {shown ? <b>{props.title}</b> : props.title}
        </span>
        {shown && <div>
            {events.map((e, i) => <div key={i}>{JSON.stringify(e)}</div>)}
        </div>}
    </Root>
}

interface RP {
    shown: boolean
    top: string
    styleChildren: boolean
}
const Root = styled.div`
    pointer-events: auto;
    background: white;
    position: fixed;
    width: 25%;
    overflow: scroll;
    right: 0;
    top: ${(p: RP) => p.top};
    height: ${(p: RP) => (p.shown ? '100%' : '')};
    ${(p: RP) =>
        p.styleChildren &&
        `>div {
            height: 100%;
            >div {
                border: 1px solid black;
                margin: 5px;
                padding: 5px;
            }
        }`}
`

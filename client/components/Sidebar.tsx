import { h, JSX } from 'preact' // eslint-disable-line
import { getClientTree, getTree } from '@/data/rootTree'
import { useState } from 'preact/hooks'

// @ts-ignore
import styled from 'styled-components'
import type { MyCursor } from '@shared'
export function Sidebar(): JSX.Element {
    return <>
        <OneSidebar cursor={getTree().select('events')} title="Event History" top="0" />
        <OneSidebar cursor={getClientTree().select('serverCalls')} title="Server calls" top="1em" />
    </>
}

function OneSidebar<T>(props: { cursor: MyCursor<T[]>, title: string, top: string }): JSX.Element {
    const c = props.cursor
    const [shown, setShown] = useState(false)
    const [events, setEvents] = useState(c.get())
    c.on('update', () => setEvents(c.get()))
    return <Root shown={shown} top={props.top}>
        <span onClick={() => setShown(s => !s)}>
            {shown ? <b>{props.title}</b> : props.title}
        </span>
        {shown &&
            <div>
                {events.map((e, i) => <div key={i}>{JSON.stringify(e)}</div>)}
            </div>}
    </Root>
}

interface RP { shown: boolean, top: string }
const Root = styled.div`
    pointer-events: auto;
    background: white;
    position: absolute;
    width: 25%;
    overflow: scroll;
    right: 0;
    top: ${(p: RP) => p.top};
    height: ${(p: RP) => p.shown ? '100%' : ''};
    >div {
        height: 100%;
        >div {
            border: 1px solid black;
            margin: 5px;
            padding: 5px;
        }
    }
`

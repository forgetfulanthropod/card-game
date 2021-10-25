import { h, JSX } from 'preact' // eslint-disable-line
import { getTree } from '@/data/rootTree'
import { useState } from 'preact/hooks'

// @ts-ignore
import styled from 'styled-components'
export default function EventHistorySideBar(): JSX.Element {
    const [shown, setShown] = useState(true)
    const s = getTree().select('events')
    const [events, setEvents] = useState(s.get())
    s.on('update', () => setEvents(s.get()))
    return <Root shown={shown}>
        <span onClick={() => setShown(s => !s)}>Event history</span>
        {shown &&
            <div>
                {events.map(e => <div key={e.uid}>{JSON.stringify(e)}</div>)}
            </div>}
    </Root>
}

interface RP { shown: boolean }
const Root = styled.div`
    pointer-events: auto;
    background: white;
    position: absolute;
    width: 25%;
    overflow: scroll;
    right: 0;
    top: 0;
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

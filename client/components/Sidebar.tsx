import type { Gamestate } from '@shared'
import type { SCursor } from 'baobab'
import { h, JSX } from 'preact' // eslint-disable-line
import { useState } from 'preact/hooks'
import JSONInput from 'react-json-editor-ajrm'
// @ts-expect-error
import locale from 'react-json-editor-ajrm/locale/en'
// @ts-expect-error
import styled from 'styled-components'

import { getClientTree, getTree } from '@/data/rootTree'


interface JSONEditData {
    plainText: unknown
    markupText: unknown
    json: unknown
    jsObject: unknown
    lines: unknown
    error: unknown
}

export function Sidebar(): JSX.Element {
    return <div style={{ pointerEvents: 'auto' }}>
        <OneSidebar cursor={getTree().select('events')} title="Event History" top="0" />
        <OneSidebar cursor={getClientTree().select('serverCalls')} title="Server calls" top="1em" />
        <GamestateEditor top="2em" />
    </div>
}

function GamestateEditor(props: { top: string }): JSX.Element {
    const [data, setData] = useState(getTree().get())
    getTree().on('update', () => { setData(getTree().get()) })
    const [shown, setShown] = useState(false)
    const title = 'Edit gamestate tree'
    return <Root shown={shown} top={props.top} styleChildren={false}>
        <span onClick={() => setShown(s => !s)}>
            {shown ? <b>{title}</b> : title}
        </span>
        {shown &&
            <JSONInput
                id='gamestate-editor'
                theme='light_mitsuketa_tribute'
                locale={locale}
                placeholder={data}
                height='100%'
                onChange={(data: JSONEditData) => {
                    getTree().set(data.jsObject as Gamestate)
                }}
            />}
    </Root>
}

function OneSidebar<T>(props: { cursor: SCursor<T[]>, title: string, top: string }): JSX.Element {
    const c = props.cursor
    const [shown, setShown] = useState(false)
    const [events, setEvents] = useState(c.get())
    c.on('update', () => setEvents(c.get()))
    return <Root shown={shown} top={props.top} styleChildren={true}>
        <span onClick={() => setShown(s => !s)}>
            {shown ? <b>{props.title}</b> : props.title}
        </span>
        {shown &&
            <div>
                {events.map((e, i) => <div key={i}>{JSON.stringify(e)}</div>)}
            </div>}
    </Root>
}

interface RP { shown: boolean, top: string, styleChildren: boolean }
const Root = styled.div`
    pointer-events: auto;
    background: white;
    position: absolute;
    width: 25%;
    overflow: scroll;
    right: 0;
    top: ${(p: RP) => p.top};
    height: ${(p: RP) => p.shown ? '100%' : ''};
    ${(p: RP) => p.styleChildren &&
        `>div {
            height: 100%;
            >div {
                border: 1px solid black;
                margin: 5px;
                padding: 5px;
            }
        }`
    }
`

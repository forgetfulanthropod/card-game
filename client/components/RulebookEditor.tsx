import { h, Fragment, JSX, Ref, RefObject } from 'preact' // eslint-disable-line
import Editor from '@monaco-editor/react'

// @ts-ignore
import styled from 'styled-components'
import { useRef, useState } from 'preact/hooks'
import { rulebookAction } from '@/actions'
import { useCursor } from './util'
import { getTree } from '@/data/rootTree'
import type { Rulebook } from '@shared'
const EditorWrap = styled.div`
    // z-index: 10;
    pointer-events: auto;
    position: fixed;
    top: 3vh;
    left: 1vw;
    width: 98vw;
`

const ButtonGroup = styled.div`
    // z-index: 11;
    pointer-events: auto;
    position: fixed;
    top: 0;
    left: 0;
    & * {
        background-color: #04aa6d; /* Green background */
        border: 1px solid green; /* Green border */
        color: white; /* White text */
        padding: 10px 24px; /* Some padding */
        cursor: pointer; /* Pointer/hand icon */
        float: left; /* Float the buttons side by side */
    }

    & *:not(:last-child) {
        border-right: none; /* Prevent double borders */
    }

    /* Clear floats (clearfix hack) */
    &:after {
        content: "";
        clear: both;
        display: table;
    }

    /* Add a background color on hover */
    & *:hover {
        background-color: #3e8e41;
    }
`

export function RulebookEditor(_props: Empty): JSX.Element {
    const ref: MonacoRef = useRef(null)
    const [id, setId] = useState('default')
    const [showMonaco, setShowMonaco] = useState(false)
    const rulebooks = useCursor(getTree().select('rulebooks'))
    const curRulebook = useCursor(getTree().select('curRulebook'))
    if (curRulebook == null) { throw Error('null rulebook') }
    return <>
        {showMonaco && <Monaco mref={ref} defaultValue={JSON.stringify(curRulebook, null, 4)} />}
        <ButtonGroup>
            <button onClick={() => {
                // if (showMonaco) alert(`current value: ${ref.current?.getValue()}`)
                setShowMonaco(s => !s)
            }}>
                Open/close
            </button>
            <button
                onClick={() => {
                    const rulebookString = ref.current?.getValue()
                    if (rulebookString == null) { throw Error() }
                    const rulebook = JSON.parse(rulebookString) as Rulebook
                    void rulebookAction({ do: 'new', rulebook })
                }}>
                Save new
            </button>
            {/* <button onClick={() => setShowSelector(s => !s)}>Open existing</button>
            {showSelector && */}
            <Selector
                value={curRulebook?.name}
                options={rulebooks?.map(r => r.name) ?? []}
                onChoice={(s) => {
                    const id = rulebooks?.find(r => r.name === s)?.id
                    if (id == null) { throw Error }
                    setId(id)
                    void rulebookAction({ do: 'choose', id })
                }} />
            <button
                onClick={() => { void rulebookAction({ do: 'delete', id }) }}
            >Delete current</button>
        </ButtonGroup>
    </>
}

type MonacoRef = RefObject<{ getValue(): string }>

function Monaco(props: { mref: MonacoRef, defaultValue: string }): JSX.Element {
    return <EditorWrap>
        <Editor
            onMount={(editor, _monaco) => props.mref.current = editor}
            height="98vh"
            defaultLanguage="json"
            defaultValue={props.defaultValue}
        />
    </EditorWrap>
}

function Selector(props: { options: string[], onChoice: (s: string) => void, value: string }): JSX.Element {
    // @ts-expect-error
    return <select value={props.value} onChange={e => props.onChoice(e?.target?.value)}>
        {props.options.map(o =>
            <option key={o} value={o}>{o}</option>)}
    </select>
}

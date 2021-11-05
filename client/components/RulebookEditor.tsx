import { h, Fragment, JSX, Ref, RefObject } from 'preact' // eslint-disable-line
import Editor from '@monaco-editor/react'

// @ts-ignore
import styled from 'styled-components'
import { useEffect, useRef, useState } from 'preact/hooks'
import { makeNewUser, rulebookAction } from '@/actions'
import { useCursor } from './util'
import { getTree } from '@/data/rootTree'
import type { Rulebook } from '@shared'
import toast from 'react-hot-toast'
import type { editor } from 'monaco-editor'
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

// TODO: make an edit (i.e. overwrite) button
// TODO: edit the name outside of the rulebook
// TODO: add a "saved at" field programatically

export function RulebookEditor(): JSX.Element {
    const ref: MonacoRef = useRef(null)
    const [shown, setShown] = useState(false)
    const rulebooks = useCursor(getTree().select('rulebooks'))
    const curRulebook = useCursor(getTree().select('curRulebook'))
    const name = curRulebook != null ? JSON.parse(curRulebook).name : null
    useEffect(() => {
        if (curRulebook == null) return
        ref.current?.setValue(curRulebook)
    }, [curRulebook])
    if (curRulebook == null) { toast.error('null curRulebook'); return <></> }
    if (rulebooks == null) { toast.error('null rulebooks'); return <></> }
    return <>
        {shown && <Monaco mref={ref} defaultValue={curRulebook} />}
        <ButtonGroup>
            <button onClick={() => setShown(s => !s)}>Open/close</button>
            <Selector
                value={name}
                options={rulebooks}
                onChoice={async newName => {
                    await rulebookAction({ do: 'choose', name: newName })
                    await makeNewUser({ username: 'alice' })
                }} />
            {shown && <>
                <button onClick={() => addNewRulebook(ref, rulebooks)}>Save new</button>
                <button onClick={() => overwriteRulebook(ref, name)}>Overwrite</button>
                <button onClick={() => deleteRulebook(name)}>Delete current</button>
            </>}
        </ButtonGroup>
    </>
}

type MonacoRef = RefObject<editor.IStandaloneCodeEditor>

async function deleteRulebook(name: string): Promise<void> {
    if (name === 'default') {
        toast.error('cannot delete default rulebook')
        return
    }
    await rulebookAction({ do: 'delete', name })
    toast('deleted')
}


async function addNewRulebook(ref: MonacoRef, rulebooks: string[]): Promise<void> {
    const newRulebook = parseRulebook(ref)
    if (newRulebook == null) return
    if (newRulebook.name === 'default') {
        toast.error('cannot save rulebook with name \'default\'')
        return
    }
    if (rulebooks.includes(newRulebook.name)) {
        toast.error('already have rulebook with that name')
        return
    }
    await rulebookAction({ do: 'new', rulebook: newRulebook })
    await makeNewUser({ username: 'alice' })
    toast('added')
}

function parseRulebook(ref: MonacoRef): Mb<Rulebook> {
    const rulebookString = ref.current?.getValue()
    if (rulebookString == null) { throw Error() }
    try {
        const newRulebook = JSON.parse(rulebookString) as Rulebook
        return newRulebook
    } catch (e) {
        toast.error('error parsing rulebook')
        return null
    }
}

async function overwriteRulebook(ref: MonacoRef, name: string): Promise<void> {
    const newRulebook = parseRulebook(ref)
    if (newRulebook == null) return
    if (newRulebook.name === 'default') {
        toast.error('cannot save rulebook with name \'default\'')
        return
    }
    if (name === 'default') {
        toast.error('cannot overwrite default. save new instead.')
        return
    }
    await rulebookAction({ do: 'delete', name })
    await rulebookAction({ do: 'new', rulebook: newRulebook })
    await makeNewUser({ username: 'alice' })
    toast('overwritten')
}

function Monaco(props: { mref: MonacoRef, defaultValue: string }): JSX.Element {

    return <EditorWrap>
        <Editor
            onMount={(editor, _monaco) => { props.mref.current = editor }}
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

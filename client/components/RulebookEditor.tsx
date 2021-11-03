import { h, Fragment, JSX, Ref, RefObject } from 'preact' // eslint-disable-line
import Editor from '@monaco-editor/react'

// @ts-ignore
import styled from 'styled-components'
import { useRef, useState } from 'preact/hooks'

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
    & button {
        background-color: #04aa6d; /* Green background */
        border: 1px solid green; /* Green border */
        color: white; /* White text */
        padding: 10px 24px; /* Some padding */
        cursor: pointer; /* Pointer/hand icon */
        float: left; /* Float the buttons side by side */
    }

    & button:not(:last-child) {
        border-right: none; /* Prevent double borders */
    }

    /* Clear floats (clearfix hack) */
    &:after {
        content: "";
        clear: both;
        display: table;
    }

    /* Add a background color on hover */
    & button:hover {
        background-color: #3e8e41;
    }
`

export function RulebookEditor(_props: Empty): JSX.Element {
    const ref: MonacoRef = useRef(null)
    const [shown, setShown] = useState(true)
    return <>
        {shown && <Monaco mref={ref} />}
        <ButtonGroup>
            <button onClick={() => {
                if (shown) alert(`current value: ${ref.current?.getValue()}`)
                setShown(s => !s)
            }}>
                Open/close
            </button>
            <button>Save new</button>
            <button>Open existing</button>
            <button>Delete current</button>
        </ButtonGroup>
    </>
}

type MonacoRef = RefObject<{ getValue(): string }>

function Monaco(props: { mref: MonacoRef }): JSX.Element {
    return <EditorWrap>
        <Editor
            onMount={(editor, _monaco) => props.mref.current = editor}
            height="98vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
        />
    </EditorWrap>
}

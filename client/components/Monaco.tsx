import { h, Fragment, JSX } from 'preact' // eslint-disable-line
import Editor from '@monaco-editor/react'
import { useRef } from 'preact/hooks'

// @ts-ignore
import styled from 'styled-components'

const X = styled.span`
    pointer-events: auto;
    position: fixed;
    top: 1vh;
    left: 1vw;
    font-size: x-large;
    background-color: white;
    border-radius: 10%;
    border: 1px solid black;
    z-index: 11;
`

const EditorWrap = styled.div`
    z-index: 10;
    pointer-events: auto;
    position: fixed;
    top: 1vh;
    left: 1vw;
    width: 98vw;
`

export function Monaco(props: { onClose: (text?: string) => void }): JSX.Element {
    const ref = useRef<{ getValue(): string }>()

    return <>
        <X onClick={() => props.onClose(ref.current?.getValue())}>X</X>
        <EditorWrap>
            <Editor
                onMount={(editor, _monaco) => ref.current = editor}
                height="98vh"
                defaultLanguage="javascript"
                defaultValue="// some comment"
            />
        </EditorWrap>
    </>
}

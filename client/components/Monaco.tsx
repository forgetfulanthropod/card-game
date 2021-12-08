import { Fragment, h, JSX, RefObject } from 'preact' // eslint-disable-line
// @ts-ignore
import styled from 'styled-components'

import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'


export type MonacoRef = RefObject<editor.IStandaloneCodeEditor>


export const EditorWrap = styled.div`
    // z-index: 10;
    pointer-events: auto;
    position: fixed;
    top: 6vh;
    left: 1vw;
    width: 98vw;
`

export function Monaco(props: {
    mref: MonacoRef
    defaultValue: string
    onClose?: () => void
    foldLevel?: number
}): JSX.Element {
    const { foldLevel = 1, mref } = props
    // may need uselayouteffect?
    // useEffect(() => {
    //     if (!mref.current) return
    //     void mref.current
    // }, [])
    return <EditorWrap>
        {props.onClose &&
            <button onClick={props.onClose}>
                close
            </button>
        }
        <Editor
            onMount={async (editor, _monaco) => {
                mref.current = editor
                // void editor.getAction(`editor.foldLevel${foldLevel}`).run()
                await editor.getAction('editor.foldRecursively').run()
                for (let i = 0; i < foldLevel; i++)
                    await editor.getAction('editor.unfold').run()
                console.log('i tried to fold it ok')
            }}
            height="88vh"
            defaultLanguage="json"
            defaultValue={props.defaultValue}
        />
    </EditorWrap>
}

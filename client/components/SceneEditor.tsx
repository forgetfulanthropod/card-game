import { Fragment, Ref, RefObject } from 'react' // eslint-disable-line

import { useEffect, useRef, useState } from 'react'
import type { BattleScene, Rulebook } from 'shared'
import toast from 'react-hot-toast'
import { useCursor } from './util'
import type { MonacoRef } from './Monaco'
import { Monaco } from './Monaco'
import { getTree } from '@/data'
import { callApi } from '@/callApi'
import { styled } from '@/config'
import { ROCursor } from 'sbaobab'

const ButtonGroup = styled.div`
    // z-index: 11;
    pointer-events: auto;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    & * {
        background: none; /* no background */
        color: white; /* White text */
        padding: 6px 20px; /* Some padding */
        cursor: pointer; /* Pointer/hand icon */
        float: left; /* Float the buttons side by side */
        opacity: 0.3;
    }

    & *:not(:last-child) {
        border-right: none; /* Prevent double borders */
    }

    /* Clear floats (clearfix hack) */
    &:after {
        content: '';
        clear: both;
        display: table;
    }

    /* Add a background color on hover */
    & *:hover {
        border-radius: 0 0 12px 12px;
        opacity: 1;
        background-color: #3e8e41;
    }
`

// TODO: make an edit (i.e. overwrite) button
// TODO: edit the name outside of the rulebook
// TODO: add a "saved at" field programatically

export function SceneEditor(): JSXElement {
    const ref: MonacoRef = useRef(null)
    const [shown, setShown] = useState(false)

    const scene = useCursor(getTree().select('scene') as ROCursor<BattleScene>)

    useEffect(() => {
        if (scene == null) return
        ref.current?.setValue(getJSON(scene))
    }, [scene])

    return <>
        {shown && <Monaco mref={ref} defaultValue={getJSON(scene)} />}
        <ButtonGroup>
            <button onClick={() => setShown(s => !s)}>
                {!shown ? 'edit scene' : 'minimize editor'}
            </button>
            {shown && <>
                <button
                    onClick={() =>
                        callApi('setBattleScene', {
                            scene: JSON.parse(ref.current?.getValue()!),
                        })
                    }
                >
                    Overwrite
                </button>
            </>}
        </ButtonGroup>
    </>
}

function getJSON(scene: BattleScene): string {
    //@ts-expect-error
    return JSON.stringify(scene, '\n', '  ')
}

// async function deleteRulebook(name: string): Promise<void> {
//     if (name === 'default') {
//         toast.error('cannot delete default rulebook')
//         return
//     }
//     await callApi('rulebookAction', { do: 'delete', name })
//     toast('deleted')
// }

// async function addNewRulebook(
//     ref: MonacoRef,
//     rulebooks: string[],
//     username: string
// ): Promise<void> {
//     const newRulebook = parseRulebook(ref)
//     if (newRulebook == null) return
//     if (newRulebook.name === 'default') {
//         toast.error("cannot save rulebook with name 'default'")
//         return
//     }
//     if (rulebooks.includes(newRulebook.name)) {
//         toast.error('already have rulebook with that name')
//         return
//     }
//     await callApi('rulebookAction', { do: 'new', rulebook: newRulebook })
//     await callApi('makeNewUser', { username })
//     toast('added')
// }

// function parseRulebook(ref: MonacoRef): Mb<Rulebook> {
//     const rulebookString = ref.current?.getValue()
//     if (rulebookString == null) {
//         throw Error()
//     }
//     try {
//         const newRulebook = JSON.parse(rulebookString) as Rulebook
//         return newRulebook
//     } catch (e) {
//         toast.error('error parsing gameState')
//         return null
//     }
// }

// async function overwriteRulebook(
//     ref: MonacoRef,
//     name: string,
//     username: string
// ): Promise<void> {
//     const newRulebook = parseRulebook(ref)
//     if (newRulebook == null) return
//     if (newRulebook.name === 'default') {
//         toast.error("cannot save rulebook with name 'default'")
//         return
//     }
//     if (name === 'default') {
//         toast.error('cannot overwrite default. save new instead.')
//         return
//     }
//     await callApi('rulebookAction', { do: 'delete', name })
//     await callApi('rulebookAction', { do: 'new', rulebook: newRulebook })
//     await callApi('makeNewUser', { username })
//     toast('overwritten')
// }

// function Selector(props: {
//     options: string[]
//     onChoice: (s: string) => void
//     value: string
// }): JSXElement {
//     return <select
//         value={props.value}
//         // @ts-ignore-error
//         onChange={e => props.onChoice(e?.target?.value)}
//     >
//         {props.options.map(o => <option key={o} value={o}>
//             {o}
//         </option>)}
//     </select>
// }

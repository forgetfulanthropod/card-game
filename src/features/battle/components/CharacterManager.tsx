import type { h, JSX } from 'preact'
import produce from 'immer'
import { useCallback, useReducer, useState } from 'preact/hooks'
import { makeInitialPlayerCharacters } from 'data/battle/factories'
import AllCharacters from './AllCharacters'
import { sceneData as scene } from 'data/rootTree'
import { dispatch } from 'data/battle'

export default function CharacterManager(): JSX.Element {
    const [shown, setShown] = useState(true)
    // const [state, dispatch] = useReducer(reducer,)

    const reset = useCallback(() => {
        setShown(false)
        // dispatch({ a: 'fullReset' })
        setTimeout(() => setShown(true), 1000)
    }, [])
    if (!shown) { return <></> }
    return <AllCharacters
        reset={reset}
        state={scene}
        dispatch={dispatch}
    />
}

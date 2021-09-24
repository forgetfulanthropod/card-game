import React, { useCallback, useState } from 'react'
import AllCharacters from './AllCharacters'

export default function CharacterManager(): JSX.Element {
    const [shown, setShown] = useState(true)

    const reset = useCallback(() => {
        setShown(false)
        setTimeout(() => setShown(true), 500)
    }, [])
    return <>
        {shown && <AllCharacters reset={reset} />}
    </>
}

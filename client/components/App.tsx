import './global.css'

import { useEffect, useState } from 'preact/hooks'

import { GameManager } from './GameManager'
import { UsernameEntry } from './UsernameEntry'
import { emitUsername } from '@/socket'

export function App(): JSXElement {
    const [username, setUsername] = useState(
        localStorage.getItem('username') ?? ''
    )
    const [ready, setReady] = useState(false)
    // console.log({ username })

    useEffect(() => {
        if (username.length > 0) {
            emitUsername(username)
            setReady(true)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return username && !ready ? (
        <>loading</>
    ) : ready ? (
        <GameManager username={username} />
    ) : (
        <UsernameEntry
            onEnter={username => {
                localStorage.setItem('username', username)
                setUsername(username)
                emitUsername(username)
                setReady(true)
            }}
        />
    )
}

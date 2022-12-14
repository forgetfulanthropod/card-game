import './global.css'

import { useEffect, useState } from 'react'

import { GameManager } from './GameManager'
// import { UsernameEntry } from './UsernameEntry'
import { emitUsername } from '@/socket'
import { NewStartScreen } from './NewStartScreen'
import { callServerApi } from '@/callServerApi'

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

    const handleStartGame = async (userId: string) => {
        localStorage.setItem('username', userId)
        setUsername(userId)
        emitUsername(userId)
        const runId = await callServerApi('startRun', {userId})
        setReady(true)
    }

    return username && !ready ? (
        <>loading</>
    ) : ready ? (
        <GameManager username={username} />
    ) : (
        <NewStartScreen
            onEnter={handleStartGame}
        />
    )
}

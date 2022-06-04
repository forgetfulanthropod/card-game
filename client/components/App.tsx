import './global.css'

import { useEffect, useState } from 'preact/hooks'

import { GameManager } from './GameManager'
import { UsernameEntry } from './UsernameEntry'
import { callApi } from '@/actions'
import { attachServerListener, getSocket } from '@/connection'
import { initializeBoababTree } from '@/data'
import { startPixi } from '@/elementsUtil'

const log = (...args: unknown[]) => true && console.log(...args)

export function App(): JSXElement {
    const [username, setUsername] = useState(
        localStorage.getItem('username') ?? ''
    )
    const [ready, setReady] = useState(false)
    console.log({ username })

    useEffect(() => {
        if (username.length > 0) void start()
        async function start() {
            await fullClientStart(username)
            setReady(true)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return username && !ready ? (
        <>loading</>
    ) : ready ? (
        <GameManager username={username} />
    ) : (
        <UsernameEntry
            onEnter={async username => {
                localStorage.setItem('username', username)
                setUsername(username)
                await fullClientStart(username)
                setReady(true)
            }}
        />
    )
}

async function fullClientStart(username: string) {
    log('doing full start')

    const result = await callApi('MaybeMakeUser', { username })
    const socket = getSocket()
    console.log('I am telling the server my username:', username)
    socket.emit('username', { username, socketId: socket.id })
    if (result == null || result?.status === 'error') {
        throw Error("couldn't make/load user account")
    }

    initializeBoababTree(result.result)
    log('everything loaded up')
    log('attaching server data listener')
    attachServerListener()
    void startPixi(document.getElementById('pixi-root') as HTMLCanvasElement)
}

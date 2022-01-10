import '../global.css'

import { useLocalStorageState } from 'ahooks'
import { useEffect, useState } from 'preact/hooks'

import { maybeMakeUser } from '@/actions'
import { attachServerListener } from '@/connection'
import { waitForGameStateToFill } from '@/data/rootTree'
import { startPixi } from '@/elements/main'

import GameManager from './GameManager'
import UsernameEntry from './UsernameEntry'

const log = (...args: unknown[]) => true && console.log(...args)

export default function App(): JSXElement {
    // const [username, setUsername] = useState('')
    const [username_, setUsername] = useLocalStorageState('username')
    const username = username_ ?? ''
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
                await fullClientStart(username)
                setUsername(username)
                setReady(true)
            }}
        />
    )
}

async function fullClientStart(username: string) {
    log('doing full start')
    // await Promise.all([waitForGameStateToFill(), maybeMakeUser({ username })])
    const p1 = waitForGameStateToFill()
    await maybeMakeUser({ username })
    await p1
    log('everything loaded up')
    log('attaching server data listener')
    attachServerListener()
    void startPixi(document.getElementById('pixi-root') as HTMLCanvasElement)
}

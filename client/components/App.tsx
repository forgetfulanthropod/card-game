import '../global.css'

import { useState } from 'preact/hooks'

import { maybeMakeUser } from '@/actions'
import { attachServerListener } from '@/connection'
import { waitForGameStateToFill } from '@/data/rootTree'
import { startPixi } from '@/elements/main'

import GameManager from './GameManager'
import UsernameEntry from './UsernameEntry'

const log = (...args: unknown[]) => true && console.log(...args)

export default function App(): JSXElement {
    const [username, setUsername] = useState('')

    return username ? (
        <GameManager username={username} />
    ) : (
        <UsernameEntry
            onEnter={async username => {
                await fullClientStart(username)
                setUsername(username)
            }}
        />
    )
}

async function fullClientStart(username: string) {
    log('doing full start')
    await Promise.all([waitForGameStateToFill(), maybeMakeUser({ username })])
    log('everything loaded up')
    log('attaching server data listener')
    attachServerListener()
    void startPixi(document.getElementById('pixi-root') as HTMLCanvasElement)
}

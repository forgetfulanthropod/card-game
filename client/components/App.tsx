import { h, JSX, Fragment } from 'preact' // eslint-disable-line
import GameManager from './GameManager'
import UsernameEntry2 from './UsernameEntry2'

import { waitForGameStateToFill } from '@/data/rootTree'
import { maybeMakeUser } from '@/actions'
import { attachServerListener } from '@/connection'
import { start } from '@/elements/main'
import { useState } from 'preact/hooks'

const log = (...args: unknown[]) => true && console.log(...args)

export default function App(): JSX.Element {
    const [username, setUsername] = useState('')

    return username ? (
        <GameManager username={username} />
    ) : (
        <UsernameEntry2
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
    start(document.getElementById('pixi-root') as HTMLCanvasElement)
}

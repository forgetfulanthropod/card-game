import { Fragment, h, JSX } from 'preact' // eslint-disable-line

import { attachServerListener as attachChangeListener, waitForHey } from '@/connection'
import { waitForGameStateToFill } from '@/data/rootTree'
import { start } from '@/elements/main'
import loadAssets from '@/features/battle/logic/AssetLoader'

import App from './App'
import { useState } from 'preact/hooks'
import { maybeMakeUser } from '@/actions'

const log = (...args: unknown[]) => true && console.log(args)

export default function UsernameEntry(): JSX.Element {
    const [username, setUsername] = useState('')
    const [started, setStarted] = useState(false)
    if (!started)
        return <>
            <h1>Enter username</h1>
            <input
                style="pointer-events: auto;"
                type="text"
                value={username}
                onChange={e =>
                    // @ts-expect-error
                    setUsername(e?.target?.value)}
                onKeyUp={async e => {
                    if (e.key === 'Enter') {
                        await fullClientStart(username)
                        setStarted(true)
                    }
                }}
            />
        </>
    return <App username={username} />
}

async function fullClientStart(username: string) {
    await Promise.all([
        waitForGameStateToFill(),
        waitForHey(),
        maybeMakeUser({ username }),
        loadAssets(),
    ])
    log('everything loaded up')
    log('attaching server data listener')
    attachChangeListener()
    start(document.getElementById('pixi-root') as HTMLCanvasElement)

}

import { Fragment, h, JSX } from 'preact' // eslint-disable-line

import { attachServerListener } from '@/connection'
import { waitForGameStateToFill } from '@/data/rootTree'
import { start } from '@/elements/main'

import GameManager from './GameManager'
import { useState } from 'preact/hooks'
import { maybeMakeUser } from '@/actions'

const log = (...args: unknown[]) => true && console.log(...args)

export default function UsernameEntry(): JSXElement {
    const [username, setUsername] = useState('')
    const [started, setStarted] = useState(false)
    if (!started)
        return (
            <>
                <h1 style='color: white;'>Enter username</h1>
                <input
                    style='pointer-events: auto;'
                    type='text'
                    value={username}
                    onChange={e =>
                        // @ts-expect-error
                        setUsername(e?.target?.value)
                    }
                    onKeyUp={async e => {
                        if (e.key === 'Enter') {
                            await fullClientStart(username)
                            setStarted(true)
                        }
                    }}
                />
            </>
        )
    return <GameManager username={username} />
}

async function fullClientStart(username: string) {
    log('doing full start')
    await Promise.all([waitForGameStateToFill(), maybeMakeUser({ username })])
    log('everything loaded up')
    log('attaching server data listener')
    attachServerListener()
    start(document.getElementById('pixi-root') as HTMLCanvasElement)
}

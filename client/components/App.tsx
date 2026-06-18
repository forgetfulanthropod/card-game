// import './global.css'   // styles pre-built via tailwind cli to public/styles.css and linked in index.html (plugin compat workaround)

import { useEffect, useState, createContext } from 'react'

import { GameManager } from './GameManager'
import { getClientEnv } from '@/util/getClientEnv'
import { NewStartScreen } from './NewStartScreen'

import { UserID } from 'shared'

interface IAppContext {
    inPixi: boolean
    setInPixi: React.Dispatch<React.SetStateAction<boolean>>
    userId: UserID
    setUserId: React.Dispatch<React.SetStateAction<UserID>>
    IS_PRODUCTION: boolean
}

export const AppContext = createContext<IAppContext>({
    inPixi: false,
    setInPixi: () => {},
    userId: '',
    setUserId: () => {},
    IS_PRODUCTION: false,
})

export function App(): JSXElement {
    const IS_PRODUCTION = getClientEnv('IS_PRODUCTION') === 'true'
    const [userId, setUserId] = useState('')
    const [inPixi, setInPixi] = useState(false)

    const appContext = {
        inPixi,
        setInPixi,
        userId,
        setUserId,
        IS_PRODUCTION,
    }

    const preventRightClick = (e: MouseEvent) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (IS_PRODUCTION)
            window.addEventListener('contextmenu', preventRightClick)
        return () =>
            window.removeEventListener('contextmenu', preventRightClick)
    }, [])

    return (
        <AppContext.Provider value={appContext}>
            <GameManager userId={userId} setInPixi={setInPixi}>
                {!inPixi && <NewStartScreen />}
            </GameManager>
        </AppContext.Provider>
    )
}

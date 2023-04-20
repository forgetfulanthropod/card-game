import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'
import { getClientEnv } from '@/util/getClientEnv'
import { getPromiseForTreeInitialized, isTreeInitialized } from '@/data'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from './App'

export function GameManager(props: { username: string, setInPixi: React.Dispatch<React.SetStateAction<boolean>>, children?: React.ReactNode }): JSXElement {
    const { username, children } = props
    const isProduction = getClientEnv('IS_PRODUCTION')
    const [isLoaded, setIsLoaded] = useState(isTreeInitialized())
    const { inPixi } = useContext(AppContext);

    useEffect(() => {
        getPromiseForTreeInitialized().then(() => setIsLoaded(true))
    }, [])

    return <AppWrap>
        <ResetButton username={username} />
        {!isProduction && isLoaded && inPixi && <>
            <RulebookEditor username={username} />
            <SceneEditor />
        </>}
        {children}
    </AppWrap>
}

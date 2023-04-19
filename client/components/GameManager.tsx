import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'
import { getClientEnv } from '@/util/getClientEnv'
import { getPromiseForTreeInitialized, isTreeInitialized } from '@/data'
import { useEffect, useState } from 'react'

export function GameManager(props: { username: string, children?: React.ReactNode }): JSXElement {
    const { username, children } = props
    const isProduction = getClientEnv('IS_PRODUCTION')
    const [isLoaded, setIsLoaded] = useState(isTreeInitialized())

    useEffect(() => {
        getPromiseForTreeInitialized().then(() => setIsLoaded(true))
    }, [])

    return <AppWrap>
        <ResetButton username={username} />
        {!isProduction && isLoaded && <>
            <RulebookEditor username={username} />
            <SceneEditor />
        </>}
        {children}
    </AppWrap>
}

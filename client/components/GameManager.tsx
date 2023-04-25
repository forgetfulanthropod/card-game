import { ResetButton } from './ResetButton'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'
import { getClientEnv } from '@/util/getClientEnv'
import { getPromiseForTreeInitialized, isTreeInitialized } from '@/data'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from './App'
import { styled } from '@/config'

const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 1.3vw;
`

export function GameManager(props: { username: string, setInPixi: React.Dispatch<React.SetStateAction<boolean>>, children?: React.ReactNode }): JSXElement {
    const { username, children } = props
    const isProduction = getClientEnv('IS_PRODUCTION')
    const [isLoaded, setIsLoaded] = useState(isTreeInitialized())
    const { inPixi } = useContext(AppContext);

    useEffect(() => {
        getPromiseForTreeInitialized().then(() => setIsLoaded(true))
    }, [])

    return <Relative>
        <ResetButton username={username} />
        {!isProduction && isLoaded && inPixi && <>
            <RulebookEditor username={username} />
            <SceneEditor />
        </>}
        {children}
    </Relative>
}

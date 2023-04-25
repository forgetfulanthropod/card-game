import { ResetButton } from './ResetButton'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'
import { getClientEnv } from '@/util/getClientEnv'
import { getPromiseForTreeInitialized, isTreeInitialized } from '@/data'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from './App'
import { styled } from '@/config'
import { UserID } from 'shared'

const Relative = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 1.3vw;
`

export function GameManager(props: {
    userId: UserID
    setInPixi: React.Dispatch<React.SetStateAction<boolean>>
    children?: React.ReactNode
}): JSXElement {
    const { userId, children } = props
    const isProduction = getClientEnv('IS_PRODUCTION')
    const [isLoaded, setIsLoaded] = useState(isTreeInitialized())
    const { inPixi } = useContext(AppContext)

    useEffect(() => {
        getPromiseForTreeInitialized().then(() => setIsLoaded(true))
    }, [])

    return <Relative>
        <ResetButton userId={userId} />
        {!isProduction && isLoaded && inPixi && <>
            <RulebookEditor userId={userId} />
            <SceneEditor />
        </>}
        {children}
    </Relative>
}

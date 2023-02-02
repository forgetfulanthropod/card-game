import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'
import { AwaitGameState } from './AwaitGameState'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'

export function GameManager(props: { username: string }): JSXElement {
    const { username } = props

    console.log('process.env.IS_PRODUCTION', process.env.IS_PRODUCTION)

    const isProduction = !!process.env.IS_PRODUCTION

    return <AppWrap>
        {/* <div>
            On branch {"'"}
            {process.env.CLIENT_GIT_BRANCH}
            {"'"}
        </div> */}
        <Toaster />
        <ResetButton username={username} />
        {/* <Sidebar /> */}$
        {isProduction ? (
            <></>
        ) : (
            <AwaitGameState>
                <RulebookEditor username={username} />
                <SceneEditor />
            </AwaitGameState>
        )}
        {/* <TestCounter /> */}
        {/* <WalletAddress /> */}
        {/* <AutoPlay /> */}
    </AppWrap>
}

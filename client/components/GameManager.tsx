import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'
import { AwaitGameState } from './AwaitGameState'
import { RulebookEditor } from './RulebookEditor'

export function GameManager(props: { username: string }): JSXElement {
    const { username } = props
    const isProduction = process.env.IS_PRODUCTION === 'true'

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
            </AwaitGameState>
        )}
        {/* <TestCounter /> */}
        {/* <WalletAddress /> */}
        {/* <AutoPlay /> */}
    </AppWrap>
}

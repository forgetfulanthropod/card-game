import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'
import { AwaitTree } from './AwaitTree'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'

export function GameManager(props: { username: string }): JSXElement {
    const { username } = props

    const isProduction = !!process.env.IS_PRODUCTION

    console.log({ isProduction })

    return <AppWrap>
        {/* <div>
            On branch {"'"}
            {process.env.CLIENT_GIT_BRANCH}
            {"'"}
        </div> */}
        <Toaster />
        <ResetButton username={username} />
        {/* <Sidebar /> */}
        {isProduction ? (
            <></>
        ) : (
            <AwaitTree>
                <RulebookEditor username={username} />
                <SceneEditor />
            </AwaitTree>
        )}
        {/* <TestCounter /> */}
        {/* <WalletAddress /> */}
        {/* <AutoPlay /> */}
    </AppWrap>
}

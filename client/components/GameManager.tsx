import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'

export function GameManager(props: { username: string }): JSXElement {
    const { username } = props
    return <AppWrap>
        <div>
            On branch {"'"}
            {process.env.CLIENT_GIT_BRANCH}
            {"'"}
        </div>
        <Toaster />
        <ResetButton username={username} />
        {/* <Sidebar /> */}
        {/* <RulebookEditor username={username} /> */}
        {/* <TestCounter /> */}
        {/* <WalletAddress /> */}
        {/* <AutoPlay /> */}
    </AppWrap>
}

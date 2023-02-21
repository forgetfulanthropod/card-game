import { Toaster } from 'react-hot-toast'

import { AppWrap } from './AppWrap'
import { ResetButton } from './ResetButton'
import { AwaitTree } from './AwaitTree'
import { RulebookEditor } from './RulebookEditor'
import { SceneEditor } from './SceneEditor'
import { getClientEnv } from '@/util/getClientEnv'

export function GameManager(props: { username: string }): JSXElement {
    const { username } = props

    const isProduction = getClientEnv('IS_PRODUCTION')


    return <AppWrap>
        {/* <div>
            On branch {"'"}
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

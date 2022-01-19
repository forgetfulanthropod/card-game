import { Toaster } from 'react-hot-toast'

import { getTree } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'

import AppWrap from './AppWrap'
import { FullScreenInfo } from './FullScreenInfo'
import ResetButton from './ResetButton'
import { useCursor } from './util'

export default function GameManager(props: { username: string }): JSXElement {
    const { username } = props
    const sceneType = useCursor(getTree().select('scene').select('name'))
    return <AppWrap>
        <div>
            On branch {"'"}
            {process.env.CLIENT_GIT_BRANCH}
            {"'"}
        </div>
        <Toaster />
        <ResetButton username={username} />
        {/* <BlessingToggles /> */}
        {sceneType === 'battle' && <Battle />}
        <FullScreenInfo />
        {/* <Sidebar /> */}
        {/* <RulebookEditor username={username} /> */}
        {/* <TestCounter /> */}
        {/* <WalletAddress /> */}
        {/* <AutoPlay /> */}
    </AppWrap>
}

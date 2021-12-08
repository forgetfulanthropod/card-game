import { h, JSX } from 'preact' // eslint-disable-line
import { Toaster } from 'react-hot-toast'

import { getTree } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'

import AppWrap from './AppWrap'
import { BlessingToggles } from './BlessingToggles'
import { FullScreenInfo } from './FullScreenInfo'
import ResetButton from './ResetButton'
import { RulebookEditor } from './RulebookEditor'
import { Sidebar } from './Sidebar'
import { useCursor } from './util'
import WalletAddress from './WalletAddress'
import { AutoPlay } from './autoplay/AutoPlay'

export default function GameManager(props: { username: string }): JSX.Element {
    const { username } = props
    const sceneType = useCursor(getTree().select('scene').select('name'))
    return (
        <AppWrap>
            <div>
                On branch {"'"}
                {process.env.CLIENT_GIT_BRANCH}
                {"'"}
            </div>
            <Toaster />
            <ResetButton username={username} />
            <BlessingToggles />
            {sceneType === 'battle' && <Battle />}
            <FullScreenInfo />
            <Sidebar />
            <RulebookEditor username={username} />
            {/* <TestCounter /> */}
            <WalletAddress />
            <AutoPlay />
        </AppWrap>
    )
}

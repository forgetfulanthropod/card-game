import { h, JSX } from 'preact' // eslint-disable-line
import { Toaster } from 'react-hot-toast'

import { getTree } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'

import AppWrap from './AppWrap'
import { FullScreenInfo } from './FullScreenInfo'
import ResetButton from './ResetButton'
import { RulebookEditor } from './RulebookEditor'
import { Sidebar } from './Sidebar'
import { useCursor } from './util'


export default function App(): JSX.Element {
    const sceneType = useCursor(getTree().select('scene').select('name'))
    return <AppWrap>
        <div>On branch {'\''}{process.env.CLIENT_GIT_BRANCH}{'\''}</div>
        <Toaster />
        <Sidebar />
        <ResetButton />
        {sceneType === 'battle' && <Battle />}
        <FullScreenInfo />
        <RulebookEditor />
        {/* <TestCounter /> */}
    </AppWrap>
}

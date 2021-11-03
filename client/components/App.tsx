import { h, JSX } from 'preact' // eslint-disable-line
import { Toaster } from 'react-hot-toast'

import { getTree } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'

import AppWrap from './AppWrap'
import { FullScreenInfo } from './FullScreenInfo'
import ResetButton from './ResetButton'
import { Sidebar } from './Sidebar'
import { useCursor } from './util'
import { Monaco } from './Monaco'
import { useState } from 'preact/hooks'


export default function App(): JSX.Element {
    const sceneType = useCursor(getTree().select('scene').select('name'))
    const [showMonaco, setShowMonaco] = useState(true)
    return <AppWrap>
        <div>On branch {'\''}{process.env.CLIENT_GIT_BRANCH}{'\''}</div>
        {showMonaco && <Monaco onClose={s => { alert(s); setShowMonaco(false) }} />}
        <Toaster />
        <Sidebar />
        <ResetButton />
        <FullScreenInfo />
        {sceneType === 'battle' && <Battle />}
        {/* <TestCounter /> */}
    </AppWrap>
}

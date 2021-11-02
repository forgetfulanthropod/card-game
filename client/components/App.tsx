import { h, JSX } from 'preact' // eslint-disable-line
import { useEffect, useState } from 'preact/hooks'
import { Toaster } from 'react-hot-toast'

import { getTree } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'

import AppWrap from './AppWrap'
import ResetButton from './ResetButton'
import { Sidebar } from './Sidebar'
import type { SCursor } from 'baobab'


export default function App(): JSX.Element {
    const sceneType = useCursor(getTree().select('scene').select('name'))

    return <AppWrap>
        <div>On branch {'\''}{process.env.CLIENT_GIT_BRANCH}{'\''}</div>
        <Toaster />
        <Sidebar />
        <ResetButton />
        {sceneType === 'battle' && <Battle />}
        {/* <TestCounter /> */}
    </AppWrap>
}

function useCursor<T>(cursor: SCursor<T>): T {
    const [v, setV] = useState(cursor.get())
    useEffect(() => {
        const cb = () => setV(cursor.get())
        cursor.on('update', cb)
        return () => cursor.off('update', cb)
    }, [cursor])
    return v
}

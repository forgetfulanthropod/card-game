import type { MyCursor } from '@shared/myBaobab'
import { h, JSX } from 'preact' // eslint-disable-line
import { useEffect, useState } from 'preact/hooks'
import { Toaster } from 'react-hot-toast'

import { getTree } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'

import AppWrap from './AppWrap'
import TestCounter from './TestCounter'


export default function App(): JSX.Element {
    const sceneType = useCursor(getTree().select('scene').select('name'))

    return <AppWrap>
        <Toaster />
        {sceneType === 'battle' && <Battle />}
        <TestCounter />
    </AppWrap>
}

function useCursor<T>(cursor: MyCursor<T>): T {
    const [v, setV] = useState(cursor.get())
    useEffect(() => {
        const cb = () => setV(cursor.get())
        cursor.on('update', cb)
        return () => cursor.off('update', cb)
    }, [cursor])
    return v
}

import type { JSX } from 'preact'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Toaster } from 'react-hot-toast'

import type { MyCursor } from '@shared/myBaobab'
import { scene } from '@/data/rootTree'
import Battle from '@/features/battle/components/Battle'
import DungeonEntry from '@/features/battle/components/DungeonEntry'

import AppWrap from './AppWrap'


export default function App(): JSX.Element {
    const sceneType = useCursor(scene.select('name'))

    return <AppWrap>
        <Toaster />
        {sceneType === 'entry' && <DungeonEntry />}
        {sceneType === 'battle' && <Battle />}
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

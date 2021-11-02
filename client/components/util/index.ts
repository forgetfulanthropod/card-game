import type { SCursor } from 'baobab'
import { useEffect, useState } from 'preact/hooks'

export function useCursor<T>(cursor: SCursor<T>): T {
    const [v, setV] = useState(cursor.get())
    useEffect(() => {
        const cb = () => setV(cursor.get())
        cursor.on('update', cb)
        return () => cursor.off('update', cb)
    }, [cursor])
    return v
}

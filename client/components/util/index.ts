import { useEffect, useState } from 'react'
import type { ROCursor } from 'sbaobab'

export function useCursor<T>(cursor: ROCursor<T>): T {
    const [v, setV] = useState(cursor.get())
    useEffect(() => {
        const cb = () => setV(cursor.get())
        cursor.on('update', cb)
        return () => {cursor.off('update', cb)}
    }, [cursor])
    return v
}

export const getShortWalletAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
}

export const openNewTab = (link: string) => {
    return () => window.open(link, '_blank')
}

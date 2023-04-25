import { useEffect, useState } from 'react'
import type { ROCursor } from 'sbaobab'
import { ARBITRUM_CHAIN_ID, Nonce, WalletAddress } from 'shared'
import { SiweMessage } from 'siwe'

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

export const createSiweMessage = (address: WalletAddress, nonce: Nonce) => {
    const domain = window.location.host;
    const origin = window.location.origin;

    const message = new SiweMessage({
      domain,
      address,
      statement: 'Welcome back to Good Earth! Sign this message to login.',
      uri: origin,
      version: '1',
      chainId: ARBITRUM_CHAIN_ID,
      nonce
    });

    return message.prepareMessage();
  }

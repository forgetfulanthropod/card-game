import './global.css'

import { useEffect, useState } from 'react'

import { GameManager } from './GameManager'
// import { UsernameEntry } from './UsernameEntry'
import { emitUsername } from '@/socket'
import { NewStartScreen } from './NewStartScreen'
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SlopeWalletAdapter,
    GlowWalletAdapter,
    LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets'
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui'

export function App(): JSXElement {
    const [username, setUsername] = useState(
        localStorage.getItem('username') ?? ''
    )
    const [ready, setReady] = useState(false)
    // console.log({ username })

    useEffect(() => {
        if (username.length > 0) {
            emitUsername(username)
            setReady(true)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const endpoint = process.env.RPC_URL ?? 'https://api.metaplex.solana.com/'

    const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new SlopeWalletAdapter(), new GlowWalletAdapter(), new LedgerWalletAdapter()]

    console.log({ endpoint })

    const handleStartGame = async (userId: string) => {
        localStorage.setItem('username', userId)
        setUsername(userId)
        emitUsername(userId)
        setReady(true)
    }

    return <>
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {username && !ready ? (
                        <>loading</>
                    ) : ready ? (
                        <GameManager username={username} />
                    ) : (
                        <NewStartScreen onEnter={handleStartGame} />
                    )}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    </>
}

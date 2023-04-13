import './global.css'

import { useEffect, useState } from 'react'

import { GameManager } from './GameManager'
// import { UsernameEntry } from './UsernameEntry'
import { emitUsername } from '@/socket'
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    SlopeWalletAdapter,
    GlowWalletAdapter,
    LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { getClientEnv } from '@/util/getClientEnv'
import { NewStartScreen } from './NewStartScreen'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { arbitrum } from 'wagmi/chains'

const chains = [arbitrum]
const projectId = getClientEnv('WALLET_CONNECT_ID')

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider,
})
const ethereumClient = new EthereumClient(wagmiClient, chains)

export function App(): JSXElement {
    const [username, setUsername] = useState(
        localStorage.getItem('username') ?? ''
    )
    const [ready, setReady] = useState(false)
    const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE')

    useEffect(() => {
        if (username.length > 0) {
            emitUsername(username)
            setReady(true)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const endpoint =
        getClientEnv('RPC_URL') ?? 'https://api.metaplex.solana.com/'

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new SlopeWalletAdapter(),
        new GlowWalletAdapter(),
        new LedgerWalletAdapter(),
    ]

    const handleStartGame = async (userId: string) => {
        localStorage.setItem('username', userId)
        setUsername(userId)
        emitUsername(userId)
        setReady(true)
    }

    return <>
        <WagmiConfig client={wagmiClient}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        {GAME_IS_LIVE && username && !ready ? (
                            <>loading</>
                        ) : GAME_IS_LIVE && ready ? (
                            <GameManager username={username} />
                        ) : (
                            <NewStartScreen onEnter={handleStartGame} />
                        )}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </WagmiConfig>

        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
}

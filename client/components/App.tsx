import './global.css'

import { useEffect, useState, createContext } from 'react'

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

interface IAppContext {
    inPixi: boolean
    setInPixi: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext<IAppContext>({
    inPixi: false,
    setInPixi: () => {},
})

export function App(): JSXElement {
    const [username, setUsername] = useState(
        localStorage.getItem('username') ?? ''
    )
    const [inPixi, setInPixi] = useState(false)

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
        setInPixi(true)
    }

    const appContext = {
        inPixi,
        setInPixi,
    }

    useEffect(() => {
        // start game at last saved state on refresh for local development
        const isLocalEnv = getClientEnv('IS_LOCAL')
        if (!isLocalEnv) return
        const username = localStorage.getItem('username')
        if (username) setInPixi(true)
    }, [])

    return <>
        <AppContext.Provider value={appContext}>
            <WagmiConfig client={wagmiClient}>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                            <GameManager
                                username={username}
                                setInPixi={setInPixi}
                            >
                                {!inPixi && <NewStartScreen
                                    onEnter={handleStartGame}
                                />}
                            </GameManager>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </WagmiConfig>

            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </AppContext.Provider>
    </>
}

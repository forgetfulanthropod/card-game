import './global.css'

import { useEffect, useState, createContext } from 'react'

import { GameManager } from './GameManager'
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
import { getStringFromLocalStorage } from '@/elementsUtil'
import { UserID } from 'shared'

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
    username: UserID
    setUsername: React.Dispatch<React.SetStateAction<UserID>>
}

export const AppContext = createContext<IAppContext>({
    inPixi: false,
    setInPixi: () => {},
    username: '',
    setUsername: () => {},
})

export function App(): JSXElement {
    const IS_PRODUCTION = getClientEnv('IS_PRODUCTION')
    const [username, setUsername] = useState(
        getStringFromLocalStorage('username') ?? ''
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

    const appContext = {
        inPixi,
        setInPixi,
        username,
        setUsername,
    }

    const preventRightClick = (e: MouseEvent) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (IS_PRODUCTION) window.addEventListener('contextmenu', preventRightClick)
        return () => {
            window.removeEventListener('contextmenu', preventRightClick)
        }
    })

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
                                {!inPixi && <NewStartScreen />}
                            </GameManager>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </WagmiConfig>

            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </AppContext.Provider>
    </>
}

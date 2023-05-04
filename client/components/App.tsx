import './global.css'

import { useEffect, useState, createContext } from 'react'

import { GameManager } from './GameManager'
import { getClientEnv } from '@/util/getClientEnv'
import { NewStartScreen } from './NewStartScreen'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { arbitrum } from 'wagmi/chains'
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
    userId: UserID
    setUserId: React.Dispatch<React.SetStateAction<UserID>>
    IS_PRODUCTION: boolean
    // loading: boolean
    // setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext<IAppContext>({
    inPixi: false,
    setInPixi: () => {},
    userId: '',
    setUserId: () => {},
    IS_PRODUCTION: false,
    // loading: false,
    // setLoading: () => {},
})

export function App(): JSXElement {
    const IS_PRODUCTION = getClientEnv('IS_PRODUCTION') === 'true'
    const [userId, setUserId] = useState('')
    const [inPixi, setInPixi] = useState(false)
    // const [loading, setLoading] = useState(true)

    const appContext = {
        inPixi,
        setInPixi,
        userId,
        setUserId,
        IS_PRODUCTION,
        // loading,
        // setLoading
    }

    const preventRightClick = (e: MouseEvent) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (IS_PRODUCTION)
            window.addEventListener('contextmenu', preventRightClick)
        return () =>
            window.removeEventListener('contextmenu', preventRightClick)
    }, [])

    return <>
        <AppContext.Provider value={appContext}>
            <WagmiConfig client={wagmiClient}>
                <GameManager userId={userId} setInPixi={setInPixi}>
                    {!inPixi && <NewStartScreen />}
                </GameManager>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </AppContext.Provider>
    </>
}

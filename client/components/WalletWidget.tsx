// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
    // LedgerWalletAdapter,
    PhantomWalletAdapter,
    // SlopeWalletAdapter,
    // SolflareWalletAdapter,
    // SolletExtensionWalletAdapter,
    // SolletWalletAdapter,
    // TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { useEffect } from 'preact/hooks'

/* export default function WalletWidget() {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            // new SlopeWalletAdapter(),
            // new SolflareWalletAdapter(),
            // new TorusWalletAdapter(),
            // new LedgerWalletAdapter(),
            // new SolletWalletAdapter({ network }),
            // new SolletExtensionWalletAdapter({ network }),
        ],
        []
        // [network]
    )
    const phantom = wallets[0]
    phantom.on('connect')

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
} */

export default function WalletWidget() {
    useEffect(() => {
        void foo()
    }, [])
    return <h2>Wallet widget</h2>
}

async function foo() {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet

    // You can also provide a custom RPC endpoint
    const endpoint = clusterApiUrl(network)

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallet = new PhantomWalletAdapter()
    const connection = new Connection(endpoint)
    // wallet.
    await new Promise(resolve =>
        wallet.once('readyStateChange', s => {
            console.log('ready state:', s)
            resolve(null)
        })
    )
    await wallet.connect()
    console.log('public key:', wallet.publicKey)
    if (wallet.publicKey == null) {
        throw Error('null public key')
    }
    console.log('balance:', await connection.getBalance(wallet.publicKey))
    console.log('wallet is connected')
    // const pk: PublicKey = await new Promise(resolve => wallet.on('connect', pk => resolve(pk)))
}

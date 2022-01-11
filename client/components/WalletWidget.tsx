// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css'

import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'preact/hooks'

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
    const [image, setImage] = useState<string | null>(null)
    useEffect(() => {
        void getNftImage().then(image => setImage(image))
        // void bar()
    }, [])
    return <>
        <h2>Wallet widget</h2>
        {image != null && <img src={image} />}
    </>
}

async function getNftImage(): Promise<string> {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const connection = new Connection(
        clusterApiUrl(WalletAdapterNetwork.Mainnet)
    )
    const wallet = new PhantomWalletAdapter()
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
    // console.log('balance:', await connection.getBalance(wallet.publicKey))
    // console.log(
    //     'getTokenAccountsByOwner:',
    //     await connection.getTokenAccountsByOwner(wallet.publicKey, {
    //         programId: new PublicKey(
    //             'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    //         ),
    //     })
    // )
    const accounts = await connection.getParsedProgramAccounts(
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // TOKEN_PROGRAM_ID,
        {
            filters: [
                {
                    dataSize: 165, // number of bytes
                },
                {
                    memcmp: {
                        offset: 32, // number of bytes
                        bytes: wallet.publicKey.toBase58(), // base58 encoded string
                    },
                },
            ],
        }
    )
    console.log({ accounts })
    // @ts-expect-error
    const mint = accounts[0].account.data.parsed.info.mint
    console.log({ mint })
    const METAPLEX_ADDRESS =
        'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as const
    const metaplexPub = new PublicKey(METAPLEX_ADDRESS)
    const [pubkey, _somenum] = await PublicKey.findProgramAddress(
        [
            toBuffer('metadata'),
            metaplexPub.toBuffer(),
            new PublicKey(mint).toBuffer(),
        ],
        metaplexPub
    )
    console.log({ pubkey: pubkey.toBase58() })
    const ownedMetadata = await Metadata.load(connection, pubkey.toBase58()) //tokenPublicKey)
    console.log({ ownedMetadata })
    const uri = ownedMetadata.data.data.uri
    console.log({ uri })
    const fullData = await (await fetch(uri)).json()
    console.log({ fullData })
    return fullData.image as string
}

function toBuffer(s: string): Uint8Array {
    return new TextEncoder().encode(s)
}

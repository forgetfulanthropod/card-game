import { callApi } from '@/callApi'
import {
    Connection,
    LAMPORTS_PER_SOL,
    ParsedAccountData,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import kaijuNFTIds from '../data/validNftIds.json'

const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

export default class SolanaRPC {
    private connection: Connection
    public publicKey: string

    constructor(connection: Connection, publicKey: string) {
        this.connection = connection
        this.publicKey = publicKey
    }

    // getAccounts = async (): Promise<string[]> => {
    //     try {
    //         const solanaWallet = new SolanaWallet(this.provider)
    //         const acc = await solanaWallet.requestAccounts()
    //         return acc
    //     } catch (error) {
    //         return error as string[]
    //     }
    // }

    // getBalance = async (): Promise<string> => {
    //     try {
    //         const solanaWallet = new SolanaWallet(this.provider)
    //         const connectionConfig =
    //             await solanaWallet.request<CustomChainConfig>({
    //                 method: 'solana_provider_config',
    //                 params: [],
    //             })
    //         const conn = new Connection(connectionConfig.rpcTarget)

    //         const accounts = await solanaWallet.requestAccounts()
    //         const balance = await conn.getBalance(new PublicKey(accounts[0]))
    //         return balance.toString()
    //     } catch (error) {
    //         return error as string
    //     }
    // }

    // signMessage = async (message: string): Promise<string> => {
    //     try {
    //         const solanaWallet = new SolanaWallet(this.provider)
    //         const msg = Buffer.from(message, 'utf8')
    //         const res = await solanaWallet.signMessage(msg)
    //         return res.toString()
    //     } catch (error) {
    //         return error as string
    //     }
    // }

    // sendTransaction = async (): Promise<string> => {
    //     try {
    //         const solanaWallet = new SolanaWallet(this.provider)
    //         const connectionConfig =
    //             await solanaWallet.request<CustomChainConfig>({
    //                 method: 'solana_provider_config',
    //                 params: [],
    //             })
    //         const conn = new Connection(connectionConfig.rpcTarget)

    //         const pubKey = await solanaWallet.requestAccounts()
    //         const block = await conn.getLatestBlockhash('finalized')
    //         const TransactionInstruction = SystemProgram.transfer({
    //             fromPubkey: new PublicKey(pubKey[0]),
    //             toPubkey: new PublicKey(pubKey[0]),
    //             lamports: 0.01 * LAMPORTS_PER_SOL,
    //         })
    //         const transaction = new Transaction({
    //             blockhash: block.blockhash,
    //             lastValidBlockHeight: block.lastValidBlockHeight,
    //             feePayer: new PublicKey(pubKey[0]),
    //         }).add(TransactionInstruction)
    //         const { signature } = await solanaWallet.signAndSendTransaction(
    //             transaction
    //         )
    //         return signature
    //     } catch (error) {
    //         return error as string
    //     }
    // }

    // signTransaction = async (): Promise<string> => {
    //     try {
    //         const solanaWallet = new SolanaWallet(this.provider)
    //         const connectionConfig =
    //             await solanaWallet.request<CustomChainConfig>({
    //                 method: 'solana_provider_config',
    //                 params: [],
    //             })
    //         const conn = new Connection(connectionConfig.rpcTarget)

    //         const pubKey = await solanaWallet.requestAccounts()
    //         const block = await conn.getLatestBlockhash('finalized')
    //         const TransactionInstruction = SystemProgram.transfer({
    //             fromPubkey: new PublicKey(pubKey[0]),
    //             toPubkey: new PublicKey(pubKey[0]),
    //             lamports: 0.01 * LAMPORTS_PER_SOL,
    //         })
    //         const transaction = new Transaction({
    //             blockhash: block.blockhash,
    //             lastValidBlockHeight: block.lastValidBlockHeight,
    //             feePayer: new PublicKey(pubKey[0]),
    //         }).add(TransactionInstruction)
    //         const signedTx = await solanaWallet.signTransaction(transaction)
    //         return signedTx.signature?.toString() || ''
    //     } catch (error) {
    //         return error as string
    //     }
    // }

    getTokenAccounts = async (
        connection: Connection,
        walletAddress: string
    ) => {
        return await connection.getParsedProgramAccounts(
            new PublicKey(TOKEN_PROGRAM),
            {
                filters: [
                    {
                        dataSize: 165,
                    },
                    {
                        memcmp: {
                            offset: 32,
                            bytes: walletAddress,
                        },
                    },
                ],
            }
        )
    }

    getKaijusOwnedByUser = async () => {
        console.log('Getting kaijus owned by user')
        try {
            if (!this.connection) {
                console.warn('No Solana RPC Connection!')
                return 0
            }
            const walletAddress = (await this.publicKey) as string
            const tokenAccounts = await this.getTokenAccounts(
                this.connection,
                walletAddress
            )
            const numKaijuInWallet = tokenAccounts.filter(account => {
                const data = account.account.data as ParsedAccountData
                const nftPublicKey = data?.parsed?.info?.mint // the particular nft's public key, not its mint authority
                const amountOwned = data?.parsed?.info?.tokenAmount?.amount // will be === 1 if user still owns the kaiju
                return kaijuNFTIds.includes(nftPublicKey) && amountOwned > 0
            }).length

            const numKaijuInGoodEarth = await this.getKaijuInGoodEarth(
                walletAddress
            )
            console.log({ numKaijuInWallet })
            console.log({ numKaijuInGoodEarth })

            return numKaijuInWallet + numKaijuInGoodEarth
        } catch (e) {
            console.error(e)
            return 0
        } finally {
            return 0
        }
    }

    userOwnsKaijus = async () => {
        return (await this.getKaijusOwnedByUser()) > 0
    }

    private getKaijuInGoodEarth = async (walletAddress: string) => {
        const { numKaijuOwned } = await callApi('getNumKaijuInGoodEarth', {
            walletAddress,
        })
        return numKaijuOwned
    }
}

import {
    Connection,
    LAMPORTS_PER_SOL,
    ParsedAccountData,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import { CustomChainConfig, SafeEventEmitterProvider } from '@web3auth/base'
import { SolanaWallet } from '@web3auth/solana-provider'
import kaijuNFTIds from '../data/validNftIds.json'

const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

export default class SolanaRPC {
    private provider: SafeEventEmitterProvider
    private connection: Connection | null

    constructor(provider: SafeEventEmitterProvider) {
        this.provider = provider
        this.connection = null
        this.asyncInitConnection()
    }

    asyncInitConnection = async () => {
        const solanaWallet = new SolanaWallet(this.provider)
        const connectionConfig = await solanaWallet.request<CustomChainConfig>({
            method: 'solana_provider_config',
            params: [],
        })
        const connection = new Connection(connectionConfig.rpcTarget)

        this.connection = connection
    }

    getPublicKey = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider)
            const acc = await solanaWallet.requestAccounts()
            return acc[0]
        } catch (error) {
            return error as string
        }
    }

    getAccounts = async (): Promise<string[]> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider)
            const acc = await solanaWallet.requestAccounts()
            return acc
        } catch (error) {
            return error as string[]
        }
    }

    getBalance = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider)
            const connectionConfig =
                await solanaWallet.request<CustomChainConfig>({
                    method: 'solana_provider_config',
                    params: [],
                })
            const conn = new Connection(connectionConfig.rpcTarget)

            const accounts = await solanaWallet.requestAccounts()
            const balance = await conn.getBalance(new PublicKey(accounts[0]))
            return balance.toString()
        } catch (error) {
            return error as string
        }
    }

    signMessage = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider)
            const msg = Buffer.from('Test Signing Message ', 'utf8')
            const res = await solanaWallet.signMessage(msg)
            return res.toString()
        } catch (error) {
            return error as string
        }
    }

    sendTransaction = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider)
            const connectionConfig =
                await solanaWallet.request<CustomChainConfig>({
                    method: 'solana_provider_config',
                    params: [],
                })
            const conn = new Connection(connectionConfig.rpcTarget)

            const pubKey = await solanaWallet.requestAccounts()
            const block = await conn.getLatestBlockhash('finalized')
            const TransactionInstruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(pubKey[0]),
                toPubkey: new PublicKey(pubKey[0]),
                lamports: 0.01 * LAMPORTS_PER_SOL,
            })
            const transaction = new Transaction({
                blockhash: block.blockhash,
                lastValidBlockHeight: block.lastValidBlockHeight,
                feePayer: new PublicKey(pubKey[0]),
            }).add(TransactionInstruction)
            const { signature } = await solanaWallet.signAndSendTransaction(
                transaction
            )
            return signature
        } catch (error) {
            return error as string
        }
    }

    signTransaction = async (): Promise<string> => {
        try {
            const solanaWallet = new SolanaWallet(this.provider)
            const connectionConfig =
                await solanaWallet.request<CustomChainConfig>({
                    method: 'solana_provider_config',
                    params: [],
                })
            const conn = new Connection(connectionConfig.rpcTarget)

            const pubKey = await solanaWallet.requestAccounts()
            const block = await conn.getLatestBlockhash('finalized')
            const TransactionInstruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(pubKey[0]),
                toPubkey: new PublicKey(pubKey[0]),
                lamports: 0.01 * LAMPORTS_PER_SOL,
            })
            const transaction = new Transaction({
                blockhash: block.blockhash,
                lastValidBlockHeight: block.lastValidBlockHeight,
                feePayer: new PublicKey(pubKey[0]),
            }).add(TransactionInstruction)
            const signedTx = await solanaWallet.signTransaction(transaction)
            return signedTx.signature?.toString() || ''
        } catch (error) {
            return error as string
        }
    }

    getPrivateKey = async (): Promise<string> => {
        const privateKey = await this.provider.request({
            method: 'solanaPrivateKey',
        })

        return privateKey as string
    }

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
        console.log('getting kaijus owned by user')
        if (!this.connection) return [] as string[]
        const tokenAccounts = await this.getTokenAccounts(
            this.connection,
            await this.getPublicKey()
        )
        const kaijusOwned = tokenAccounts.filter(account => {
            const data = account.account.data as ParsedAccountData
            const nftPublicKey = data?.parsed?.info?.mint // the particular nft's public key, not its mint authority
            const amountOwned = data?.parsed?.info?.tokenAmount?.amount // will be === 1 if user still owns the kaiju
            return (kaijuNFTIds.includes(nftPublicKey) && amountOwned > 0)
        })
        console.log({ tokenAccounts })
        console.log({ kaijusOwned })
        return kaijusOwned
    }

    userOwnsKaijus = async () => {
        return (await this.getKaijusOwnedByUser()).length > 0
    }
}

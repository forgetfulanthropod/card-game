import { useEffect, useState } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'

const clientId =
    'BP1YocnslDonXIeUl3UCHspqktxarNggpqJ4XZkq1AUQdTTGYukBt9i9Ft0uegY4jxDh4b9HP9Y9qIn7lMzMGGg'

export const useWeb3Auth = () => {
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
        null
    )

    useEffect(() => {
        const init = async () => {
            try {
                const web3Auth = new Web3Auth({
                    clientId,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.SOLANA,
                        chainId: '0x3', // 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                        rpcTarget: 'https://api.devnet.solana.com',
                    },
                })

                setWeb3Auth(web3Auth)

                await web3Auth.initModal()
                if (web3Auth.provider) {
                    setProvider(web3Auth.provider)
                }
            } catch (error) {
                console.error(error)
            }
        }

        init()
    }, [])

    return { web3Auth, provider }
}

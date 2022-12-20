import { useEffect, useState } from 'react'
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import {
    CHAIN_NAMESPACES,
    LoginMethodConfig,
    SafeEventEmitterProvider,
    WALLET_ADAPTERS,
} from '@web3auth/base'
import {
    OpenloginAdapter,
    OpenloginAdapterOptions,
} from '@web3auth/openlogin-adapter'
import SolanaRPC from '@/chain/solanaRPC'

const clientId =
    'BJaYppmI_VLiFpLgONXI36enJpCVv2B7C_jzpo6YZERju9bQTTBoPo3B0gzTso-Ab6v5KC6iBwANc1dPAaYjYvg'

export const useWeb3Auth = () => {
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
    const [solanaRPC, setSolanaRPC] = useState<SolanaRPC | null>(null)
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
        null
    )

    const web3AuthOptions: Web3AuthOptions = {
        clientId,
        chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: process.env.RPC_URL,
        },
        uiConfig: {
            theme: 'dark',
            loginMethodsOrder: ['twitter'],
            appLogo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg', // Your App Logo Here
        },
    }

    const openLoginAdapterOptions: OpenloginAdapterOptions = {
        adapterSettings: {
            clientId,
            network: 'mainnet',
            uxMode: 'popup',
            whiteLabel: {
                name: 'Your app Name',
                logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
                logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
                defaultLanguage: 'en',
                dark: true, // whether to enable dark mode. defaultValue: false
            },
            loginConfig: {
                email: {
                    name: 'Custom Auth Login',
                    verifier: 'YOUR_FACEBOOK_VERIFIER_NAME', // Please create a verifier on the developer dashboard and pass the name here
                    typeOfLogin: 'email_password', // Pass on the login provider of the verifier you've created
                    clientId: 'FACEBOOK_CLIENT_ID_1234567890', // Pass on the clientId
                },
            },
        },
    }

    const initModalConfig = {
        modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
                label: 'openlogin',
                showOnModal: true, // setting it to false will hide all social login methods from modal.
                loginMethods: getLoginMethodsConfig(),
            },
            [WALLET_ADAPTERS.TORUS_SOLANA]: {
                label: 'torus',
                showOnModal: false,
            },
            [WALLET_ADAPTERS.PHANTOM]: {
                label: 'phantom',
                showOnModal: true,
                showOnMobile: true,
            },
        },
    }

    useEffect(() => {
        const init = async () => {
            console.log('INIT WEB3 AUTH')
            try {
                const web3auth = new Web3Auth(web3AuthOptions)
                const openloginAdapter = new OpenloginAdapter(
                    openLoginAdapterOptions
                )

                web3auth.configureAdapter(openloginAdapter)
                await web3auth.initModal(initModalConfig)

                if (web3auth.provider) {
                    setProvider(web3auth.provider)
                    // setSolanaRPC(new SolanaRPC(web3auth.provider))
                    console.log(
                        'inside useweb3auth... solana rpc has been set!'
                    )
                }

                setWeb3Auth(web3auth)
            } catch (error) {
                console.error(error)
            }
        }

        init()
    }, [])

    return { web3Auth, provider, solanaRPC }
}

/** Currently all socials disabled */
const getLoginMethodsConfig = () => {
    const loginMethods = [
        'google',
        'facebook',
        'twitter',
        'reddit',
        'discord',
        'twitch',
        'apple',
        'line',
        'github',
        'kakao',
        'linkedin',
        'weibo',
        'wechat',
        'email_passwordless',
    ] as const

    const disabledLoginMethodsParam: LoginMethodConfig = {}
    loginMethods.forEach(
        method =>
            (disabledLoginMethodsParam[method] = {
                name: `${method} login`,
                showOnModal: false,
            })
    )

    return disabledLoginMethodsParam
}

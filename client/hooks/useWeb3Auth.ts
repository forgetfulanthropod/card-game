import { useEffect, useState } from 'react'
import { Web3Auth } from '@web3auth/modal'
import {
    CHAIN_NAMESPACES,
    LoginMethodConfig,
    SafeEventEmitterProvider,
    WALLET_ADAPTERS,
} from '@web3auth/base'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

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
                const web3auth = new Web3Auth({
                    clientId,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.SOLANA,
                        chainId: '0x3', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                        rpcTarget: 'https://api.devnet.solana.com', // This is the public RPC we have added, please pass on your own endpoint while creating an app
                    },
                    uiConfig: {
                        theme: 'dark',
                        loginMethodsOrder: ['twitter'],
                        appLogo:
                            'https://web3auth.io/images/w3a-L-Favicon-1.svg', // Your App Logo Here
                    },
                })

                const openloginAdapter = new OpenloginAdapter({
                    adapterSettings: {
                        clientId,
                        network: 'testnet',
                        uxMode: 'popup',
                        whiteLabel: {
                            name: 'Your app Name',
                            logoLight:
                                'https://web3auth.io/images/w3a-L-Favicon-1.svg',
                            logoDark:
                                'https://web3auth.io/images/w3a-D-Favicon-1.svg',
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
                })
                web3auth.configureAdapter(openloginAdapter)
                setWeb3Auth(web3auth)

                await web3auth.initModal({
                    modalConfig: {
                        [WALLET_ADAPTERS.OPENLOGIN]: {
                            label: 'openlogin',
                            // setting it to false will hide all social login methods from modal.
                            showOnModal: true,
                            loginMethods: getLoginMethodsConfig()
                        },
                        [WALLET_ADAPTERS.TORUS_SOLANA]: {
                            label: 'torus',
                            showOnModal: false,
                        },
                        [WALLET_ADAPTERS.PHANTOM]: {
                            label: 'phantom',
                            showOnModal: true,
                        },
                    },
                })
                if (web3auth.provider) {
                    setProvider(web3auth.provider)
                }
            } catch (error) {
                console.error(error)
            }
        }

        init()
    }, [])

    return { web3Auth, provider }
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
        'email_passwordless'
    ] as const

    const disabledLoginMethodsParam: LoginMethodConfig = {};
    loginMethods.forEach(method => disabledLoginMethodsParam[method] = { name: `${method} login`, showOnModal: true})

    return disabledLoginMethodsParam
}

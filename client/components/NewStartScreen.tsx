import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { useState, useEffect } from 'react'
import { PrimaryButton } from './StartScreen'
import { GameModeContainer } from './StartScreen'
import { NavIconWrapper } from './StartScreen'
import SolanaRPC from '@/chain/solanaRPC'
import { UserProfileIcon } from './StartScreen/UserProfileIcon'
import { WalletGateModal } from './StartScreen/WalletGateModal'
import { openNewTab } from './util'
import { callServerApi } from '@/callServerApi'
import { BUILD_VER, UserID } from 'shared'
import { TutorialModal } from './StartScreen/TutorialModal'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { collectData, initAnalytics } from '@/analytics/collectData'
import { ClosedGameModal } from './StartScreen/ClosedGameModal'
import { UsernameModal } from './StartScreen/UsernameModal'
import { getClientEnv } from '@/util/getClientEnv'
require('@solana/wallet-adapter-react-ui/styles.css')
import { useWeb3Modal } from '@web3modal/react'

import { Web3Modal, Web3Button } from '@web3modal/react'
import { useSignMessage, useAccount as useWeb3Wallet } from 'wagmi'

export type UserDoc = {
    walletAddress: string
    kaijusOwned: number
    userId: UserID
    username: string | null
} | null

type WalletAddress = `0x${string}`

export function NewStartScreen(props: {
    onEnter: (userId: string) => void
}): JSXElement {
    // const wallet = useWallet()
    // const { connection } = useConnection()
    // const encodedPublicKey = wallet.publicKey
    // useEffect(() => {
    //     if (connection && encodedPublicKey) {
    //         const publicKey = encodedPublicKey?.toBase58()
    //         setPublicKey(publicKey)
    //         const solana = new SolanaRPC(connection, publicKey)
    //         console.log({ connection, publicKey })
    //         initUserDoc(solana).then(() => {
    //             console.log('UserDoc initialized')
    //         })
    //     }
    // }, [connection, encodedPublicKey])
    const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE')
    const WALLET_GATED = getClientEnv('WALLET_GATED')

    const { isOpen, open, close, setDefaultChain } = useWeb3Modal()

    const [userDoc, setUserDoc] = useState<UserDoc>(null)
    const [nonce, setNonce] = useState('')

    const [showGateModal, setShowGateModal] = useState(false)
    const [showTutorial, setShowTutorial] = useState(false)
    const [showClosedGameModal, setShowClosedGameModal] = useState(false)
    const [showUsernameModal, setShowUsernameModal] = useState(false)

    const { address, isConnected, status } = useWeb3Wallet()

    const getNonce = async ()  => {
        const { nonce } = await callServerApi('getNonce', {})
        setNonce(nonce)
        return nonce
    }

    const handleLogin = async (walletAddress: WalletAddress) => {
        const { userId, username, accessToken } = await callServerApi('login', {
            walletAddress,
        })
        console.log({userId, username, accessToken})
        const kaijusOwned = getKaijusOwned(walletAddress)
        setUserDoc({ walletAddress, kaijusOwned, userId, username })
        console.log('Set User Doc', {
            walletAddress,
            kaijusOwned,
            userId,
            username,
        })
        initAnalytics(userId)
        collectData('login', {
            method: 'connect_wallet',
        })
    }

    const getKaijusOwned = (walletAddress: WalletAddress) => {
        //TODO
        return 0
    }

    const handlePlayButtonClick = async () => {
        console.log('Handling Play button click')
        if (!GAME_IS_LIVE) {
            return setShowClosedGameModal(true)
        }
        console.log('Game is live')
        if (!userDoc) {
            if (!WALLET_GATED) {
                // F2P USER FLOW --- TO COMPLETE
                const walletAddress = localStorage.getItem('walletAddress') ?? Math.random().toString().slice(2)
                localStorage.setItem('walletAddress', walletAddress) // tmp
                const { userId, username } = await callServerApi('login', {
                    walletAddress,
                })

                setUserDoc({
                    walletAddress,
                    kaijusOwned: 1,
                    userId,
                    username,
                })
                return setShowUsernameModal(true)
            } else {
                // const connectWalletButton =
                //     document.getElementsByClassName('WalletMultiButton')
                // //@ts-expect-error
                // connectWalletButton[0].click() // opens wallet modal

                return
            }
        }
        console.log({ userDoc })
        if (WALLET_GATED) {
            if (userDoc.kaijusOwned === 0) return setShowGateModal(true)
        }
        if (userDoc.username === null && userDoc.userId) {
            // Likely 1st time player - wallet is connected but no username has been set
            return setShowUsernameModal(true)
        }
        console.log({ username: userDoc.username })

        props.onEnter(userDoc.userId)
        collectData('enter_game', {})
    }

    const handleTutorialClick = () => {
        setShowTutorial(true)
        collectData('tutorial_begin', {})
    }

    useEffect(() => {

        /** TODO: change this to actual F2P flow */
        const tmpWalletAddress = localStorage.getItem('walletAddress') as WalletAddress
        if (tmpWalletAddress) handleLogin(tmpWalletAddress)

        collectData('ui_ux_view', {
            page_title: 'Start Screen',
        })
    }, [])

    useEffect(() => {
        if (isConnected && address) {
            handleLogin(address)
        }
    }, [isConnected])

    // TODO: refactor modals into HOC
    return <>
        {showTutorial && <TutorialModal setShowTutorial={setShowTutorial} />}
        {showClosedGameModal && <ClosedGameModal
            setShowModal={setShowClosedGameModal}
        />}
        {showUsernameModal && <UsernameModal
            setShowModal={setShowUsernameModal}
            userDoc={userDoc}
            setUserDoc={setUserDoc}
            onSuccess={props.onEnter}
        />}
        <div
            className={`font-bigFont grid grid-rows-4 absolute left-0 w-full h-full z-0 ${
                showGateModal ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
        >
            <video
                src='./assets/backgrounds/main_menu_shed_bg.mp4'
                autoPlay
                muted
                loop
                className='w-full max-w-full absolute -z-50'
            />

            <div className='nav w-full row-span-1 flex p-2 xs:p-4 lg:p-8 justify-between items-start'>
                <div className='flex flex-col items-center w-1/6 cursor-pointer hover:scale-105 transition text-white '>
                    <img src='./logos/KaijuCards.png' />
                    <p className='uppercase pt-4 font-bigFont text-sm md:text-base tracking-widest text-stone-300 text-center opacity-50'>
                        closed alpha {BUILD_VER}
                    </p>
                </div>
                <div className='navRight flex justify-between sm:pl-12 xs:pl-6 items-start w-full pt-4 md:pt-6'>
                    <div className='grid grid-cols-3 items-center mr-4 pointer-events-auto'>
                        <NavIconWrapper link='https://magiceden.io/marketplace/kaiju_cards'>
                            <img
                                src='./logos/MagicEden.png'
                                alt='Magic Eden Marketplace'
                                className='lg:w-auto h-full'
                            />
                        </NavIconWrapper>
                        <NavIconWrapper link='https://twitter.com/KaijuCards'>
                            <img
                                src='./logos/Twitter.png'
                                alt='Twitter'
                                className=' scale-75 w-auto h-full'
                            />
                        </NavIconWrapper>
                        <NavIconWrapper link='https://dsc.gg/kaijucards'>
                            <img
                                src='./logos/Discord.png'
                                alt='Discord'
                                className='scale-110 w-auto h-full'
                            />
                        </NavIconWrapper>
                    </div>
                    {/* <button className='z-50 text-md font-bold from-[#272756] to-[#603a71] bg-gradient-to-r backdrop-blur-lg rounded-md flex items-center shadow-3xl transition-all hover:bg-black font-sans text-white px-6 py-3'
                        onClick={async () => await open()}
                    >
                        <p>Connect Wallet</p>
                    </button> */}
                    <Web3Button icon={'hide'} />
                </div>
            </div>

            <div className='bottom h-full p-2 row-span-3 grid grid-cols-12'>
                <div className='left-buttons h-full col-span-2 flex flex-col justify-end gap-2 lg:gap-4 xl:gap-6 px-3 p-2  xl:p-10'></div>
                <div className='mid-buttons h-full col-span-8 flex items-end gap-2 sm:gap-8 p-1 sm:p-2 xl:p-10'>
                    <div className='h-auto w-full flex xl:pt-4 gap-4 md:gap-8 xl:gap-12'>
                        <PrimaryButton
                            text='tutorial'
                            onClick={handleTutorialClick}
                            type='secondary'
                            size='large'
                        />
                        <PrimaryButton
                            text='play now'
                            onClick={handlePlayButtonClick}
                            type='primary'
                            size='large'
                        />
                    </div>
                </div>
                <div className='right-buttons h-full col-span-2 flex flex-col justify-end gap-2 sm:gap-4 xl:gap-6 p-1 px-3 sm:p-2 md:px-4 xl:p-10'></div>
            </div>
        </div>
    </>
}

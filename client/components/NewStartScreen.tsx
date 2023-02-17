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

export type UserDoc = {
    walletAddress: string
    numKaijusOwned: number
    userId: UserID
    username: string | null
} | null

export function NewStartScreen(props: {
    onEnter: (userId: string) => void
}): JSXElement {
    const { connection } = useConnection()
    const wallet = useWallet();
    const encodedPublicKey = wallet.publicKey
    const [publicKey, setPublicKey] = useState('')
    const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE')
    const WALLET_GATED = getClientEnv('WALLET_GATED')
    useEffect(() => {
        if (connection && encodedPublicKey) {
            const publicKey = encodedPublicKey?.toBase58()
            setPublicKey(publicKey)
            const solana = new SolanaRPC(connection, publicKey)
            console.log({ connection, publicKey })
            initUserDoc(solana).then(() => {
                console.log('UserDoc initialized')
            })
        }
    }, [connection, encodedPublicKey])

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userDoc, setUserDoc] = useState<UserDoc>(null)

    const [showGateModal, setShowGateModal] = useState(false)
    const [showTutorial, setShowTutorial] = useState(false)
    const [showClosedGameModal, setShowClosedGameModal] = useState(false)
    const [showUsernameModal, setShowUsernameModal] = useState(false)

    useEffect(() => {
        collectData('ui_ux_view', {
            page_title: 'Start Screen',
        })
    }, [])

    const initUserDoc = async (solanaRPC: SolanaRPC) => {
        const walletAddress = solanaRPC.publicKey
        const { userId, username } = await callServerApi('login', { walletAddress })
        if (!userId) {
            return window.alert(
                'Something went wrong. Please logging in try again.'
            )
        }
        console.log({userId, username})
        const numKaijusOwned = await solanaRPC.getKaijusOwnedByUser()
        setUserDoc({ walletAddress, numKaijusOwned, userId, username })
        setIsLoggedIn(true)
        console.log('Set User Doc', { walletAddress, numKaijusOwned, userId })

        initAnalytics(userId)
        collectData('login', {
            method: 'connect_wallet',
        })
    }

    const handlePlayButtonClick = async () => {
        console.log('Handling Play button click')
        if (!GAME_IS_LIVE) {
            return setShowClosedGameModal(true)
        }
        console.log('Game is live')
        if (!userDoc) {
            console.warn('No User Doc')

            if (!WALLET_GATED) {
                const walletAddress = Math.random().toString().slice(2)
                const {userId, username} = await callServerApi('login', { walletAddress })

                setUserDoc({
                    walletAddress,
                    numKaijusOwned: 1,
                    userId,
                    username
                })
            }
            const connectWalletButton = document.getElementsByClassName('WalletMultiButton')
            //@ts-expect-error
            connectWalletButton[0].click() // opens wallet modal


            return
        }
        console.log({userDoc})
        if (WALLET_GATED) {
            if (userDoc.numKaijusOwned === 0) return setShowGateModal(true)
        }
        if (userDoc.username === null && userDoc.userId) {
            return setShowUsernameModal(true)
        }
        console.log({username: userDoc.username})

        props.onEnter(userDoc.userId)
        collectData('enter_game', {})
    }

    const handleTutorialClick = () => {
        setShowTutorial(true)
        collectData('tutorial_begin', {})
    }

    // TODO: refactor modals into HOC
    return <>
        {showGateModal && <WalletGateModal
            setShowGateModal={setShowGateModal}
            publicKey={publicKey}
        />}
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
                    <WalletMultiButton className='z-50 text-sm lg:text-2xl from-[#272756] to-[#603a71] bg-gradient-to-r backdrop-blur-lg p-1 md:p-2 rounded-2xl flex items-center shadow-3xl transition-all hover:bg-black font-bigFont WalletMultiButton'
                    />
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
                            onClick={   handlePlayButtonClick}
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

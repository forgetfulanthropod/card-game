import { useState, useEffect, useContext } from 'react'
import { getStage, getStringFromLocalStorage } from '@/elementsUtil'
import { createSiweMessage, openNewTab } from './util'
import { callApi } from '@/callApi'
import { collectData, initAnalytics } from '@/analytics/collectData'
import { getClientEnv } from '@/util/getClientEnv'
require('@solana/wallet-adapter-react-ui/styles.css')
import { useWeb3Modal } from '@web3modal/react'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { useSignMessage, useAccount as useWeb3Wallet } from 'wagmi'
import { AppContext } from './App'
import {
    AuthToken,
    BUILD_VER,
    Nonce,
    UserID,
    UserType,
    WalletAddress,
} from 'shared'
import {
    UsernameModal,
    ClosedGameModal,
    TutorialModal,
    ConnectWalletModal,
    NavIconWrapper,
    PrimaryButton,
} from './StartScreen/'
import { socket } from '@/socket'

export type UserDoc = {
    userId: UserID
    userType: UserType
    username: string | null
    nonce?: Nonce
    walletAddress?: WalletAddress
} | null

export function NewStartScreen(): JSXElement {
    const GAME_IS_LIVE = getClientEnv('GAME_IS_LIVE')

    const [userDoc, setUserDoc] = useState<UserDoc>(null)
    const [showTutorial, setShowTutorial] = useState(false)
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
    const [showClosedGameModal, setShowClosedGameModal] = useState(false)
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const [clickedPlay, setClickedPlay] = useState(false)
    const [siweMessage, setSiweMessage] = useState('')
    // const [loading, setLoading] = useState(false)

    const { setUserId, setInPixi, IS_PRODUCTION } =
        useContext(AppContext)

    const { address, isConnected, status } = useWeb3Wallet()
    const { isOpen, open, close, setDefaultChain } = useWeb3Modal()
    const { signMessageAsync } = useSignMessage({
        message: siweMessage,
    })

    const handleStartGame = async (userId: string) => {
        console.log('STARTING GAME')
        callApi('loadGameState', { userId }).then(() => {
            console.log('gamestate loaded')
        })
        setUserId(userId)
        setInPixi(true)
        if (getStage()) {
            getStage().visible = true
        }
        collectData('enter_game', {})
    }

    // TODO
    const handleGuestLogin = async () => {
        console.log('Handling Guest User Login')
        const { userId, username, nonce } = await callApi('loginGuest', {
            socketId: socket.id,
            existingUserId: null,
        }) // get new guest user
        localStorage.setItem('userId', userId)
        localStorage.setItem('nonce', nonce)
        localStorage.removeItem('walletAddress')
        console.log({ userId, username, nonce })
        setUserDoc({
            userId,
            username,
            userType: 'guest',
        })
        initAnalytics(userId)
        collectData('login', {
            method: 'guest_user',
        })
        return {
            userId,
            username,
        }
    }

    const verifyAuthToken = async (
        userId: UserID,
        walletAddress: WalletAddress,
        nonce: Nonce
    ) => {
        const { authToken } = getStringFromLocalStorage('authToken')
        let authIsValid = false

        if (authToken) {
            console.log('AuthToken exists in localStorage.')
            const { result } = await callApi('verifyAuthToken', {
                userId,
                authToken,
            })
            if (result === 'failure') {
                console.log('Token is invalid!')
                localStorage.removeItem('authToken')
                const newAuthRes = await signMessageAndAuthenticate(
                    walletAddress,
                    nonce,
                    userId
                )
                authIsValid = newAuthRes.result === 'success'
            } else {
                console.log(
                    'Existing authToken is valid! Continue setting up userDoc.'
                )
                authIsValid = true
            }
        } else {
            console.log('No Existing AuthToken in local storage!')
            const { result } = await signMessageAndAuthenticate(
                walletAddress,
                nonce,
                userId
            )
            authIsValid = result === 'success'
        }

        return { authIsValid }
    }

    /** Triggered whenever the user connects wallet */
    const handleWeb3Login = async (walletAddress: WalletAddress) => {
        console.log('Handling Web3 User Login')
        const { userId, username, nonce } = await callApi('login', {
            walletAddress,
            socketId: socket.id,
        })
        const { authIsValid } = await verifyAuthToken(
            userId,
            walletAddress,
            nonce
        )

        localStorage.setItem('userId', userId)
        localStorage.setItem('nonce', nonce)
        localStorage.setItem('walletAddress', walletAddress)

        if (!authIsValid)
            return console.log('Auth is invalid! Returning early.')

        setUserDoc({
            walletAddress,
            userId,
            username,
            userType: 'web3',
            nonce,
        })
        console.log('Set User Doc!')
        initAnalytics(userId)
        collectData('login', {
            method: 'connect_wallet',
        })
        return { userId, username }
    }

    const signMessageAndAuthenticate = async (
        walletAddress: WalletAddress,
        nonce: Nonce,
        userId: UserID
    ) => {
        console.log('Triggering new message signing...')
        const message = createSiweMessage(walletAddress, nonce)
        setSiweMessage(message)
        const signature = await signMessageAsync({
            message,
        })
        const { authToken, error } = await callApi('authenticateWeb3User', {
            userId,
            message,
            signature,
        })
        console.log({ authToken })
        if (!authToken) return { result: 'failure', error }
        const verifyRes = await callApi('verifyAuthToken', {
            userId,
            authToken,
        })
        if (verifyRes.result === 'failure')
            return { result: verifyRes.result, error: verifyRes.error }
        else console.log('Verified Auth Token!')
        localStorage.setItem('authToken', authToken)
        localStorage.setItem('nonce', nonce)
        localStorage.setItem('userId', userId)
        return { result: verifyRes.result }
    }

    const handlePlayButtonClick = async () => {
        console.log('Handling Play button click')
        setClickedPlay(true)
        if (!GAME_IS_LIVE) return setShowClosedGameModal(true)

        console.log('Game is live')
        if (!userDoc) return setShowConnectWalletModal(true)
        const { userId, username, nonce, walletAddress, userType } = userDoc

        console.log({ userDoc })
        if (username === null && userId) {
            console.log('Wallet is connected but no username is set')
            // Wallet is connected but no username has been set
            return setShowUsernameModal(true)
        }

        if (userType === 'web3') {
            if (!nonce) return console.error('No nonce in state.')
            if (!walletAddress)
                return console.error('No walletAddress in state.')
            const { authIsValid } = await verifyAuthToken(
                userId,
                walletAddress,
                nonce
            )
            if (!authIsValid)
                return await signMessageAndAuthenticate(
                    walletAddress,
                    nonce,
                    userId
                )
        }

        handleStartGame(userDoc.userId)
    }

    const handleTutorialClick = () => {
        setShowTutorial(true)
        collectData('tutorial_begin', {})
    }

    useEffect(() => {
        console.debug('*** INITIAL USEEFFECT START***')
        collectData('ui_ux_view', {
            page_title: 'Start Screen',
        })

        // existing wallet users are handled in a different useEffect
        const loadGameIfExistingGuestUser = async () => {
            const { userId, walletAddress } = getStringFromLocalStorage(
                'userId',
                'walletAddress'
            )

            if (!userId) return console.log('no saved userId')
            if (walletAddress)
                return console.log(
                    'user is web3, exiting guestLogin useEffect handler'
                )
            else console.log(`found existing guest userId in localstorage`)

            await callApi('loginGuest', {
                existingUserId: userId,
                socketId: socket.id,
            })
            await callApi('loadGameState', { userId })
            setUserDoc({ userId, userType: 'guest', username: null })
            setUserId(userId)
            setInPixi(true)
        }

        loadGameIfExistingGuestUser().then(() => {
            console.log('Loaded game if existing user')
        })

        // setLoading(false)
        console.log('*** INITIAL USEEFFECT END***')
    }, [])

    /** Listen to Connect Wallet events, handle web3 login */
    useEffect(() => {
        // setLoading(true)
        console.log('*** ISCONNECTED USEEFFECT START***')

        if (isConnected && address && socket) {
            handleWeb3Login(address).then(res => {
                if (!res) return
                const { userId, username } = res
                if (!username) return setShowUsernameModal(true)
                if (clickedPlay) return handleStartGame(userId)
            })
        }
        if (!isConnected) {
            setUserDoc(null)
        }
        // setLoading(false)
        console.log('*** ISCONNECTED USEEFFECT END***')
    }, [isConnected])

    useEffect(() => {
        if (clickedPlay && userDoc && !userDoc.username)
            return setShowUsernameModal(true)
    }, [userDoc])

    return <>
        {showTutorial && <TutorialModal setShowTutorial={setShowTutorial} />}
        {showClosedGameModal && <ClosedGameModal
            setShowModal={setShowClosedGameModal}
        />}
        {showUsernameModal && <UsernameModal
            setShowModal={setShowUsernameModal}
            userDoc={userDoc}
            setUserDoc={setUserDoc}
            onSuccess={handleStartGame}
        />}
        {showConnectWalletModal && !userDoc?.userId && <ConnectWalletModal
            setShowModal={setShowConnectWalletModal}
            getNewGuestUser={handleGuestLogin}
        />}
        <div
            className={`font-bigFont grid grid-rows-4 absolute left-0 w-full h-full z-0 pointer-events-auto`}
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
                    <div className='text-white'>
                        <Web3Button icon={'hide'} />
                        {!IS_PRODUCTION && <>
                            <div className='flex flex-col justify-center text-center items-center'>
                                <p className='font-normal'>
                                    {userDoc &&
                                        (userDoc.username ||
                                            userDoc.walletAddress) &&
                                        `logged in as ${userDoc?.userType}`}
                                </p>
                                <p className='text-[10px] font-mono'>
                                    {userDoc?.userId}
                                </p>
                            </div>
                            {userDoc &&
                            (userDoc.username || userDoc.walletAddress) &&
                            userDoc?.userType === 'guest' ? (
                                <button
                                    className='text-red-400'
                                    onClick={() => {
                                        if (userDoc.userType !== 'guest') return
                                        localStorage.removeItem('walletAddress')
                                        setUserDoc(null)
                                    }}
                                >
                                    {' '}
                                    log out of guest{' '}
                                </button>
                            ) : (
                                (userDoc?.userType === 'guest' ||
                                    !userDoc) && <button
                                    className='text-red-400'
                                    onClick={async () => {
                                        // const { walletAddress } =
                                        //     await getNewGuestUser()
                                        // await handleGuestLogin(walletAddress)
                                    }}
                                >
                                    log in as guest
                                </button>
                            )}
                        </>}
                    </div>
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

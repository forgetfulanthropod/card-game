import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { useState, useEffect } from 'react'
import { PrimaryButton } from './StartScreen'
import { GameModeContainer } from './StartScreen'
import { NavIconWrapper } from './StartScreen'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import SolanaRPC from '@/chain/solanaRPC'
import { UserProfileIcon } from './StartScreen/UserProfileIcon'
import { WalletGateModal } from './StartScreen/WalletGateModal'
import { openNewTab } from './util'
import { callServerApi } from '@/callServerApi'
import { UserID } from 'shared'

const WALLET_GATING_ENABLED = false // TODO move to env

export type UserDoc = {
    walletAddress: string | null
    numKaijusOwned: number
    userId: UserID
}

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    const { web3Auth, provider } = useWeb3Auth()
    const [solanaRPC, setSolanaRPC] = useState<SolanaRPC | null>(null)

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userDoc, setUserDoc] = useState<UserDoc>({
        walletAddress: null,
        numKaijusOwned: 0,
        userId: '',
    })

    const [showGateModal, setShowGateModal] = useState(false)

    useEffect(() => {
        gtag('event', 'ui_ux_view', {
            page_title: 'Start Screen',
        })
    }, [])

    useEffect(() => {
        if (web3Auth?.cachedAdapter) {
            handleLogin().then(() => {
                console.log('USEFFECT - web3auth login handled')
            })
        }
    }, [web3Auth])

    const handleLogin = async () => {
        if (!web3Auth) {
            console.log('NO WEB3AUTH FOUND')
            return
        }

        console.log('connecting to web3auth')
        await web3Auth.connect()
        console.log('finished web3auth.connect')

        if (web3Auth && web3Auth.provider) {
            console.log('should always hit right')
            const solanaRPC = new SolanaRPC(web3Auth.provider)
            initUserDoc(solanaRPC)
            setSolanaRPC(solanaRPC)
        } else {
            console.log('no provider wtf')
        }
    }

    const initUserDoc = async (solanaRPC: SolanaRPC) => {
        console.log('initializing userDoc....')
        await solanaRPC.asyncInitConnection()
        const walletAddress = (await solanaRPC?.getAccounts())[0]
        const numKaijusOwned = (await solanaRPC.getKaijusOwnedByUser()).length
        const userIdRes = await callServerApi('login', { walletAddress })
        if (!userIdRes) {
            return window.alert('Something went wrong. Please try again.')
        }
        const { userId } = userIdRes
        setUserDoc({ walletAddress, numKaijusOwned, userId })
        setIsLoggedIn(true)
        console.log('Set User Doc', { walletAddress, numKaijusOwned, userId })

        // need to change this to a UUID retrieved from roundtrip call to postgres' user table!
        gtag('set', {
            user_id: userId,
        })

        gtag('event', 'login', {
            method: 'connect_wallet',
        })
    }

    const handleLogout = async () => {
        await web3Auth?.logout()
        setIsLoggedIn(false)
    }

    const handlePlayButtonClick = () => {
        if (WALLET_GATING_ENABLED) {
            if (!isLoggedIn) return handleLogin()
            if (userDoc.numKaijusOwned === 0) return setShowGateModal(true)
        } else {
            enterGame()
        }
    }

    const enterGame = () => {
        props.onEnter(
            userDoc.walletAddress ?? 'random-' + Math.random().toString()
        )
        gtag('event', 'enter_game')
    }

    return <>
        {showGateModal && <WalletGateModal
            setShowGateModal={setShowGateModal}
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
                        closed alpha
                    </p>
                </div>
                <div className='navRight flex justify-between sm:pl-12 xs:pl-6 items-start w-full pt-4 md:pt-6'>
                    <div className='grid grid-cols-5 items-center mr-4'>
                        <NavIconWrapper>
                            <img
                                src='./logos/MagicEden.png'
                                alt='Magic Eden Marketplace'
                                className='lg:w-auto h-full'
                            />
                        </NavIconWrapper>
                        <NavIconWrapper>
                            <img
                                src='./logos/Twitter.png'
                                alt='Twitter'
                                className=' scale-75 w-auto h-full'
                            />
                        </NavIconWrapper>
                        <NavIconWrapper>
                            <img
                                src='./logos/Discord.png'
                                alt='Discord'
                                className='scale-110 w-auto h-full'
                            />
                        </NavIconWrapper>
                        <NavIconWrapper>
                            <img
                                src='./logos/Settings.svg'
                                alt='Settings'
                                className='filter brightness-0 invert w-auto h-full'
                            />
                        </NavIconWrapper>
                    </div>
                    <UserProfileIcon
                        login={handleLogin}
                        logout={handleLogout}
                        isLoggedIn={isLoggedIn}
                        userDoc={userDoc}
                    />
                </div>
            </div>

            <div className='bottom h-full p-2 row-span-3 grid grid-cols-12'>
                <div className='left-buttons h-full col-span-2 flex flex-col justify-end gap-2 lg:gap-4 xl:gap-6 px-3 p-2  xl:p-10'></div>
                <div className='mid-buttons h-full col-span-8 flex items-end gap-2 sm:gap-8 p-1 sm:p-2 xl:p-10'>
                    <div className='h-auto w-full flex xl:pt-4 gap-4 md:gap-8 xl:gap-12'>
                        <PrimaryButton
                            text='tutorial'
                            onClick={() => {}}
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

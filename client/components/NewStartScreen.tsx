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

const WALLET_GATING_ENABLED = true // TODO move to env

export interface UserDoc {
    walletAddress: string
    numKaijusOwned: number
}

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    const { web3Auth, provider } = useWeb3Auth()
    const [solanaRPC, setSolanaRPC] = useState<SolanaRPC | null>(null)

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userDoc, setUserDoc] = useState<UserDoc>({
        walletAddress: '',
        numKaijusOwned: 0,
    })

    useEffect(() => {
        // check if theres a cached provider or a cached user session previously available
        // if it exists, load and auto connect
        // connect to Solana as well
        // if it exists but expired, reset the storage items
        // if there is none, leave everything until user interaction time
    }, [])

    useEffect(() => {
        console.log(web3Auth?.cachedAdapter)
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
        console.log(web3Auth.provider)

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
        setUserDoc({ walletAddress, numKaijusOwned })
        setIsLoggedIn(true)
        console.log({ userDoc: { walletAddress, numKaijusOwned } })
    }

    const handleLogout = async () => {
        await web3Auth?.logout()
        setIsLoggedIn(false)
    }

    const handlePlayButtonClick = () => {
        if (!isLoggedIn) return handleLogin()

        if (userDoc.numKaijusOwned === 0 && WALLET_GATING_ENABLED) {
            showWalletGateModal()
        } else {
            enterGame()
        }
    }

    const showWalletGateModal = () => {
        window.alert('BUY A KAIJU FIRST!')
    }

    const enterGame = () => {
        props.onEnter('random-' + Math.random().toString())
    }

    return <div className='font-sharp grid grid-rows-4 absolute left-0 w-full h-full pointer-events-auto'>
        <video
            src='./assets/backgrounds/main_menu_shed_bg.mp4'
            autoPlay
            loop
            className='max-w-full absolute -z-50'
        />

        <div className='nav w-full row-span-1 flex p-2 xs:p-4 lg:p-8 justify-between items-start'>
            <div className='flex w-12 2xs:w-14 xs:w-20 sm:w-24 md:w-28 xl:w-56 cursor-pointer hover:scale-105 transition'>
                <img src='./logos/KaijuCards.png' />
            </div>
            <div className='navRight flex justify-between sm:pl-12 xs:pt-2 xs:pl-6 lg:pt-4 items-start w-full'>
                <div className='grid grid-cols-4 mr-4'>
                    <NavIconWrapper>
                        <img
                            src='./logos/MagicEden.png'
                            alt='Magic Eden Marketplace'
                        />
                    </NavIconWrapper>
                    <NavIconWrapper>
                        <img
                            src='./logos/Twitter.png'
                            alt='Twitter'
                            className='p-1 sm:p-2 sm:ml-4'
                        />
                    </NavIconWrapper>
                    <NavIconWrapper>
                        <img
                            src='./logos/Discord.png'
                            alt='Discord'
                            className='scale-110'
                        />
                    </NavIconWrapper>
                    <NavIconWrapper>
                        <img
                            src='./logos/Settings.svg'
                            alt='Settings'
                            className='filter brightness-0 invert'
                        />
                    </NavIconWrapper>
                </div>
                {isLoggedIn && web3Auth ? (
                    <UserProfileIcon logout={handleLogout} userDoc={userDoc} />
                ) : (
                    <div className='flex items-center h-full'>
                        <PrimaryButton
                            text='sign in'
                            type='default'
                            size='medium'
                            onClick={handleLogin}
                        />
                    </div>
                )}
            </div>
        </div>

        <div className='bottom h-full p-2 row-span-3 grid grid-cols-12'>
            <div className='left-buttons h-full col-span-4 flex flex-col justify-end gap-2 lg:gap-4 xl:gap-6 px-3 p-2  xl:p-10'>
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
            <div className='mid-buttons h-full col-span-4 flex items-end gap-2 sm:gap-8 p-1 sm:p-2 xl:p-10'>
                <div className='h-auto w-full flex xl:pt-4 gap-2 xl:gap-4'>
                    <PrimaryButton
                        text='quests'
                        onClick={() =>
                            window.open('https://gq.kaijucards.io/', '_blank')
                        }
                        type='white'
                        size='small'
                    />
                    <PrimaryButton
                        text='forge'
                        onClick={() =>
                            window.open(
                                'https://forge.kaijucards.io/',
                                '_blank'
                            )
                        }
                        type='white'
                        size='small'
                    />
                </div>
            </div>
            <div className='right-buttons h-full col-span-4 flex flex-col justify-end gap-2 sm:gap-4 xl:gap-6 p-1 px-3 sm:p-2 md:px-4 xl:p-10'>
                <GameModeContainer
                    text='Play The First Siege'
                    isNew
                    imgSrc='./assets/main-menu/firstSiegeBanner.webp'
                />
                {/* <GameModeContainer
                    text='Play Daily Seed'
                    imgSrc='./assets/main-menu/goodEarthMap.webp'
                    isComingSoon
                /> */}
            </div>
        </div>
    </div>
}

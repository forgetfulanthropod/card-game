import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { useState, useEffect } from 'react'
import { PrimaryButton } from './StartScreen'
import { GameModeContainer } from './StartScreen'
import { NavIconWrapper } from './StartScreen'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    const { web3Auth } = useWeb3Auth()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleWeb3AuthLogin = async () => {
        if (!web3Auth) return

        await web3Auth.connect()
        console.log('web3auth is connected!!!')
        console.log(web3Auth.status)
        setIsLoggedIn(true)
    }

    return <div className='grid grid-rows-4 absolute left-0 w-full h-full pointer-events-auto'>
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
                {isLoggedIn ? (
                    <p className='text-white text-2xl'>logged in</p>
                ) : (
                    <div className='flex items-center h-full'>
                        <PrimaryButton
                            text='sign in'
                            type='default'
                            size='medium'
                            onClick={handleWeb3AuthLogin}
                        />
                    </div>
                )}
            </div>
        </div>

        <div className='bottom h-full p-2 row-span-3 grid grid-cols-12'>
            <div className='left-buttons h-full col-span-4 flex flex-col justify-end gap-2 lg:gap-4 xl:gap-6 px-3 p-2  xl:p-10'>
                <PrimaryButton
                    text='tutorial'
                    onClick={() =>
                        props.onEnter('random-' + Math.random().toString())
                    }
                    type='secondary'
                    size='large'
                />
                <PrimaryButton
                    text='play now'
                    onClick={() =>
                        props.onEnter('random-' + Math.random().toString())
                    }
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
                <GameModeContainer
                    text='Play Daily Seed'
                    imgSrc='./assets/main-menu/goodEarthMap.webp'
                    isComingSoon
                />
            </div>
        </div>
    </div>
}

import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { useState, useEffect } from 'preact/hooks'
import { PrimaryButton } from './StartScreen'
import { NavIconWrapper } from './StartScreen/NavIconWrapper'

export function NewStartScreen(props: {
    onEnter: (username: string) => void
}): JSXElement {
    return <div
        className='border-2 border-yellow-400 grid grid-rows-4 absolute left-0 w-full h-full pointer-events-auto'
    >
        <video
            src='./assets/backgrounds/main_menu_shed_bg.webm'
            autoPlay
            loop
            className='max-w-full absolute -z-50'
        />

        <div className='nav w-full border-2 border-red-800 row-span-1 flex p-4 justify-between items-center'
        // style={{ scale: `${scale}` }}
        >
            <div className='border flex w-12 2xs:w-14 xs:w-18 sm:w-32'>
                <img src='./logos/KaijuCards.png' />
            </div>
            <div className='navRight flex justify-between sm:pl-12 sm:pr-8 border-2 border-orange-400 items-center w-full'>
                <div className='grid grid-cols-4 border-4 mr-4'>
                    <NavIconWrapper>
                        <img
                            src='./logos/MagicEden.png'
                            alt='Magic Eden Marketplace'
                            className='border'
                        />
                    </NavIconWrapper>
                    <NavIconWrapper>
                        <img
                            src='./logos/Twitter.png'
                            alt='Magic Eden Marketplace'
                            className='border p-1 sm:p-2 sm:ml-4'
                        />
                    </NavIconWrapper>
                    <NavIconWrapper>
                        <img
                            src='./logos/Discord.png'
                            alt='Magic Eden Marketplace'
                            className='border scale-110'
                        />
                    </NavIconWrapper>
                    <NavIconWrapper>
                        <img
                            src='./logos/Settings.svg'
                            alt='Magic Eden Marketplace'
                            className='border filter brightness-0 invert'
                        />
                    </NavIconWrapper>
                </div>
                <div className='border flex items-center'>
                    <PrimaryButton text='sign in' type='primary' size='small' />
                </div>
            </div>
        </div>

        <div className='bottom h-full row-span-3 grid grid-cols-12'>
            <div className='left-buttons h-full border-2 col-span-4 flex flex-col justify-end gap-2 sm:gap-8 p-1 sm:p-3 md:p-5'>
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
            <div className='mid-buttons h-full border-2 col-span-4'></div>
            <div className='right-buttons h-full border-2 col-span-4'></div>
        </div>
    </div>
}

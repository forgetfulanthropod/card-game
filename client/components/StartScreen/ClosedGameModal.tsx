import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef } from 'react'
import { openNewTab } from '../util'
import { PrimaryButton } from './PrimaryButton'
import { InfoModal } from './InfoModal'

export const ClosedGameModal = ({
    setShowModal,
}: {
    setShowModal: (value: React.SetStateAction<boolean>) => void
}) => {
    const header = 'GOOD EARTH AWAITS'
    const text = <>
        Our first closed alpha (12/19/22 - 12/23/22) has come to an end! A huge
        thank you from the entire Kaiju Cards team to all of our incredible
        community members for participating. <br />
        <br /> Be sure to{' '}
        <a
            className='text-blue-500 underline cursor-pointer'
            href='https://twitter.com/KaijuCards'
            target='_blank'
            rel='noreferrer'
        >
            follow us on Twitter
        </a>{' '}
        for news on upcoming releases!
    </>

    return <InfoModal setShowModal={setShowModal}>
        <img
            src='./assets/chars/croppedJerry.png'
            className='h-8 sm:h-12 md:h-16 lg:h-24 xl:h-32'
        ></img>
        <h1
            className='uppercase font-bigFont text-lg
                    sm:text-2xl sm:py-2
                    md:text-3xl
                    lg:text-4xl lg:py-3
                    xl:text-5xl xl:py-6'
        >
            {header}
        </h1>
        <p
            className='text-left font-mono pb-2 text-[7px]
                    sm:pb-4 sm:text-xs
                    md:pb-6
                    xl:pb-10  xl:text-base'
        >
            {text}
        </p>
        <div
            className='flex justify-center w-full px-2 gap-1
                md:gap-4
                xl:gap-8'
        >
            <PrimaryButton
                text='Back to Menu'
                type='primary'
                size='small'
                onClick={() => setShowModal(false)}
            />
        </div>
    </InfoModal>
}

import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef } from 'react'
import { openNewTab } from '../util'
import { PrimaryButton } from './PrimaryButton'
import { InfoModal } from './InfoModal'
import { Web3Button } from '@web3modal/react'
import { UserID, Username } from 'shared'

export const ConnectWalletModal = ({
    setShowModal,
    getNewGuestUser,
}: {
    setShowModal: (value: React.SetStateAction<boolean>) => void
    getNewGuestUser: () => Promise<{
        userId: UserID
        username: Username | null
    }>
}) => {
    const header = 'Wallet not Connected'
    const text = <>
        Connect your wallet to customize your username, compete in leaderboards,
        and unlock new content as you progress!
    </>

    return <InfoModal setShowModal={setShowModal} isLoading={true}>
        <img
            src='./assets/chars/croppedJerry.png'
            className='h-8 sm:h-12 md:h-16 lg:h-24'
        ></img>
        <h1
            className='uppercase font-bigFont text-lg
                    sm:text-2xl sm:py-2
                    md:text-3xl
                    lg:text-4xl lg:py-3
                    xl:text-5xl xl:py-6 text-center'
        >
            {header}
        </h1>
        <p
            className='text-center font-mono pb-3 text-[6px]
                    sm:pb-6 sm:text-xs
                    md:pb-8
                    xl:text-base'
        >
            {text}
        </p>
        <div
            className='flex justify-center w-full px-2
                gap-1
                md:gap-4
                xl:gap-8'
        >
            <Web3Button icon={'hide'} />
        </div>
        <div className='w-full flex items-center my-4'>
            <div className='h-1 w-full border-stone-700/50 border-t'></div>
            <p className='px-4'>OR</p>
            <div className='h-1 w-full border-stone-700/50 border-t'></div>
        </div>
        <button
            className='font-mono text-sm text-gray-400 underline'
            onClick={getNewGuestUser}
        >
            Continue as guest
        </button>
    </InfoModal>
}

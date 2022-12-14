import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef } from 'react'
import { openNewTab } from '../util'
import { PrimaryButton } from './PrimaryButton'

export const WalletGateModal = ({
    setShowGateModal,
}: {
    setShowGateModal: (value: React.SetStateAction<boolean>) => void
}) => {
    const modalBoxRef = useRef(null)
    useOutsideClickDismisser(modalBoxRef, setShowGateModal)

    return <div className='bg-black/40 w-full h-full absolute z-50 text-white font-sharp pointer-events-auto'>
        <div className='flex h-full w-full justify-center items-center'>
            <div
                className='w-1/2 bg-stone-900/90 rounded-xl border border-black flex flex-col items-center p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 relative shadow-3xl'
                ref={modalBoxRef}
            >
                <button
                    onClick={() => setShowGateModal(false)}
                    className='absolute py-2 px-4 top-0 right-0 text-stone-300 cursor-pointer md:text-lg lg:text-xl'
                >
                    ✕
                </button>
                <img
                    src='./assets/chars/croppedJerry.png'
                    className='h-8 sm:h-12 md:h-16 lg:h-24 xl:h-32'
                ></img>
                <h1
                    className='uppercase text-lg
                    sm:text-2xl sm:py-2
                    md:text-3xl
                    lg:text-4xl lg:py-3
                    xl:text-5xl xl:py-6'
                >
                    Kaiju not found
                </h1>
                <p
                    className='text-center font-mono pb-2 text-[7px]
                    sm:pb-4 sm:text-xs sm:px-2
                    md:pb-6 md:px-4
                    xl:pb-12 xl:px-8 xl:text-base'
                >
                    The closed alpha is only available for Kaiju Cards holders.
                    Buy any Kaiju Cards NFT to get access or{' '}
                    <a
                        className='text-blue-500 underline cursor-pointer'
                        href='https://twitter.com/KaijuCards'
                        target='_blank'
                        rel='noreferrer'
                    >
                        follow us on Twitter
                    </a>{' '}
                    to get notified when the game is released to the public!
                </p>
                <div
                    className='flex justify-center w-full px-2 gap-1
                md:gap-4
                xl:gap-8'
                >
                    <PrimaryButton
                        text='Get access'
                        type='primary'
                        size='small'
                        onClick={openNewTab(
                            'https://magiceden.io/marketplace/kaiju_cards'
                        )}
                    />
                    <PrimaryButton
                        text='Back to Menu'
                        type='secondary'
                        size='small'
                        onClick={() => setShowGateModal(false)}
                    />
                </div>
            </div>
        </div>
    </div>
}

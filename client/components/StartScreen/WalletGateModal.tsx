import React from 'react'
import { PrimaryButton } from './PrimaryButton'

export const WalletGateModal = ({
    setShowGatedModal,
}: {
    setShowGatedModal: (value: React.SetStateAction<boolean>) => void
}) => {
    return <div className='bg-black/40 w-full h-full absolute z-50 text-white font-sharp pointer-events-auto'>
        <div className='flex h-full w-full justify-center items-center'>
            <div className='w-1/2 bg-stone-900/90 rounded-xl border border-black flex flex-col items-center p-8 relative'>
                <p
                    onClick={() => setShowGatedModal(false)}
                    className='absolute top-0 right-0'
                >
                    close X
                </p>
                <img
                    src='./assets/chars/croppedJerry.png'
                    className='h-32'
                ></img>
                <h1 className='uppercase text-5xl py-4'>Kaiju not found</h1>
                <p className='font-mono pt-6 pb-12 px-8 text-center'>
                    The closed alpha is only available for Kaiju Cards holders.
                    Buy any Kaiju Cards NFT to get access or{' '}
                    <a className='text-blue-500 underline cursor-pointer'>
                        follow us on Twitter
                    </a>{' '}
                    to get notified when the game is released to the public!
                </p>
                <div className='flex justify-center w-full gap-8 px-24'>
                    <PrimaryButton
                        text='Get access'
                        type='primary'
                        size='small'
                    />
                    <PrimaryButton
                        text='Back to Menu'
                        type='secondary'
                        size='small'
                    />
                </div>
            </div>
        </div>
    </div>
}

import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef } from 'react'
import { openNewTab } from '../util'
import { PrimaryButton } from './PrimaryButton'
import { InfoModal } from './InfoModal'

/** Change this to a connect your wallet modal (or just dont have anything at all) */
export const WalletGateModal = ({
    setShowModal,
    publicKey,
}: {
    setShowModal: (value: React.SetStateAction<boolean>) => void
    publicKey: string
}) => {
    const header = publicKey ? 'Kaiju not found' : 'Connect Your Wallet'
    const text = publicKey ? (
        <>
            The closed alpha is only available for Kaiju Cards holders. Buy any
            Kaiju Cards NFT to get access or{' '}
            <a
                className='text-blue-500 underline cursor-pointer'
                href='https://twitter.com/KaijuCards'
                target='_blank'
                rel='noreferrer'
            >
                follow us on Twitter
            </a>{' '}
            to get notified when the game is released to the public!
        </>
    ) : (
        <>
            The closed alpha is only available for Kaiju Cards holders. Connect
            your wallet to verify ownership!
        </>
    )

    return <InfoModal setShowModal={setShowModal}>
        <img
            src='./assets/chars/croppedJerry.png'
            className='h-8 sm:h-12 md:h-16 lg:h-24 xl:h-32'
        ></img>
        <h1
            className='uppercase font-sharp text-lg
                    sm:text-2xl sm:py-2
                    md:text-3xl
                    lg:text-4xl lg:py-3
                    xl:text-5xl xl:py-6'
        >
            {header}
        </h1>
        <p
            className='text-center font-mono pb-2 text-[7px]
                    sm:pb-4 sm:text-xs
                    md:pb-6
                    xl:pb-12  xl:text-base'
        >
            {text}
        </p>
        <div
            className='flex justify-center w-full px-2 gap-1
                md:gap-4
                xl:gap-8'
        >
            {!publicKey ? (
                <PrimaryButton
                    text='Back to Menu'
                    type='primary'
                    size='small'
                    onClick={() => setShowModal(false)}
                />
            ) : (
                <>
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
                        onClick={() => setShowModal(false)}
                    />
                </>
            )}
        </div>
    </InfoModal>
}

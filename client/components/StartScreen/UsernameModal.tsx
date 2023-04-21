import { callServerApi } from '@/callServerApi'
import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef, useState } from 'react'
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, UserID } from 'shared'
import { UserDoc } from '../NewStartScreen'
import { PrimaryButton } from './PrimaryButton'
import { InfoModal } from './InfoModal'

export const UsernameModal = ({
    setShowModal,
    userDoc,
    setUserDoc,
    onSuccess,
}: {
    setShowModal: (value: React.SetStateAction<boolean>) => void
    userDoc: UserDoc
    setUserDoc: React.Dispatch<React.SetStateAction<UserDoc>>
    onSuccess: (userId: UserID) => void
}) => {
    const [typedUsername, setTypedUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSetUsername = async () => {
        if (!userDoc) return
        setIsLoading(true)
        const { userId } = userDoc
        const result = await callServerApi('setUsername', {
            userId,
            username: typedUsername,
        })
        if (result.result === 'failure') {
            // TODO
            window.alert('Please try a different username.')
        } else {
            setUserDoc({
                walletAddress: userDoc.walletAddress,
                userId: userDoc.userId,
                kaijusOwned: userDoc.kaijusOwned,
                username: typedUsername,
            })
            onSuccess(userDoc.userId)
        }
        setIsLoading(false)
    }

    return <InfoModal setShowModal={setShowModal}>
        <div className='flex flex-col items-center justify-between'>
            <img
                src='./assets/main-menu/goodEarthMapSmall.png'
                className='h-36 w-36 my-4 rounded-full shadow-2xl border-4 border-[#fdc8a6]'
            />
            <h1
                className='uppercase font-bigFont text-lg
                                sm:text-2xl sm:py-2
                                md:text-3xl
                                lg:text-4xl lg:py-3
                                xl:text-5xl xl:py-6 text-center'
            >
                Welcome back to <br /> Good Earth
            </h1>
        </div>
        <p
            className='text-center font-mono
                        text-[7px]
                        sm:text-xs
                        xl:text-lg w-full my-4'
        >
            What should the villagers call you?
        </p>
        <div className='w-full flex justify-center pb-8'>
            <div className='w-5/6'>
                <div className='flex items-end my-8 w-full'>
                    <div className='flex flex-col w-full'>
                        <input
                            className='bg-stone-700 rounded-xl w-full text-lg focus:outline-none p-4 font-mono text-white'
                            placeholder='Choose a username...'
                            value={typedUsername}
                            onChange={e => {
                                if (
                                    e.target.value.length > MAX_USERNAME_LENGTH
                                ) {
                                    return
                                }
                                setTypedUsername(e.target.value.trim())
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleSetUsername()
                                }
                            }}
                        />
                        <p className='text-gray-400 font-light font-sans text-sm mt-1'>
                            Your username can be between {MIN_USERNAME_LENGTH}{' '}
                            and {MAX_USERNAME_LENGTH} characters long.
                        </p>
                    </div>
                </div>
                <PrimaryButton
                    text='Enter'
                    type='primary'
                    size='small'
                    onClick={handleSetUsername}
                    isLoading={isLoading}
                />
            </div>
        </div>
    </InfoModal>
}

import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import { useState, useRef, MouseEvent, useEffect } from 'react'
import type { UserDoc } from '../NewStartScreen'
import { getShortWalletAddress } from 'shared'

export const UserProfileIcon = ({
    login,
    logout,
    isLoggedIn,
    userDoc,
    ownsKaijus,
}: {
    login: () => Promise<void>
    logout: () => void
    isLoggedIn: boolean
    userDoc: UserDoc
    ownsKaijus: boolean
}) => {
    const walletAddress = userDoc?.walletAddress

    const [showActions, setShowActions] = useState(false)
    const [shortAddress, setShortAddress] = useState('')

    const actionsRef = useRef(null)
    useOutsideClickDismisser(actionsRef, setShowActions)

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (isLoggedIn) {
            setShowActions(actions => !actions)
        } else {
            login()
        }
    }

    useEffect(() => {
        if (walletAddress)
            setShortAddress(getShortWalletAddress(walletAddress ?? '0x000000'))
    }, [walletAddress])

    return <div className='flex flex-col items-end text-white'>
        <button
            className={`text-sm lg:text-2xl from-[#272756] to-[#603a71] bg-gradient-to-r backdrop-blur-lg p-1 md:p-2 rounded-2xl flex items-center shadow-3xl transition-all hover:bg-black`}
            onClick={handleClick}
        >
            {isLoggedIn ? (
                <>
                    {ownsKaijus && <img
                        src='./assets/character profiles/penguinKnight.webp'
                        className='max-w-full h-6 md:h-9 lg:h-12 rounded-2xl border border-black'
                    />}
                    <div className='flex flex-col items-start'>
                        <p className='px-2'>{shortAddress}</p>
                    </div>
                </>
            ) : (
                <p className='lg:text-4xl lg:px-3'>SIGN IN</p>
            )}
        </button>
        <div
            className={`flex flex-col text-white mt-2 rounded-xl bg-stone-700 font-sans p-1 w-2/3 font-medium z-50 text-sm shadow-3xl transition-all ${
                showActions ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            ref={actionsRef}
        >
            <button className='py-2 hover:bg-stone-900 rounded-lg'>
                Account
            </button>
            <button
                className='py-2 hover:bg-stone-900 rounded-lg'
                onClick={() => {
                    logout()
                    setShowActions(false)
                }}
            >
                Log Out
            </button>
        </div>
    </div>
}

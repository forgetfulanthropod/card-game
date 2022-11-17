import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import { useState, useRef } from 'react'
import type { UserDoc } from '../NewStartScreen'
import { getShortWalletAddress } from '../util'

export const UserProfileIcon = ({
    logout,
    userDoc,
}: {
    logout: () => void
    userDoc: UserDoc
}) => {
    const walletAddress = getShortWalletAddress(userDoc.walletAddress)
    const [showActions, setShowActions] = useState(false)
    const actionsRef = useRef(null)
    useOutsideClickDismisser(actionsRef, setShowActions)

    return <div className='flex flex-col items-end text-white'>
        <button
            className={`text-sm lg:text-2xl from-[#272756] to-[#603a71] bg-gradient-to-r backdrop-blur-lg p-1 md:p-2 rounded-2xl flex items-center shadow-3xl transition-all hover:bg-black`}
            onClick={() => setShowActions(actions => !actions)}
        >
            <img
                src='./assets/character profiles/penguinKnight.webp'
                className='max-w-full h-6 md:h-9 lg:h-12 rounded-2xl border border-black'
            />
            <div className='flex flex-col items-start'>
                {/* <p className='px-2'>KAIJU_123</p> */}
                <p className='px-2'>{walletAddress}</p>
            </div>
        </button>
        <button
            className={`text-white mt-2 rounded-xl bg-slate-700 font-sans p-1 w-2/3 font-medium z-50 text-sm shadow-3xl transition-all ${
                showActions ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            ref={actionsRef}
        >
            <p className='py-2 hover:bg-slate-900 rounded-lg'>Account</p>
            <p className='py-2 hover:bg-slate-900 rounded-lg' onClick={logout}>
                Log Out
            </p>
        </button>
    </div>
}

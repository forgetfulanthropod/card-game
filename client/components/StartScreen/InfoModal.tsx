import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef } from 'react'
import { TailSpin } from 'react-loading-icons'

export const InfoModal = ({
    setShowModal,
    children,
    isLoading,
}: {
    setShowModal: (value: React.SetStateAction<boolean>) => void
    isLoading?: boolean
    children?: React.ReactNode
}) => {
    const modalBoxRef = useRef(null)
    useOutsideClickDismisser(modalBoxRef, setShowModal)

    return <div className='bg-black/40 w-full h-full absolute z-50 text-white font-bigFont pointer-events-auto'>
        <div className='flex h-full w-full justify-center items-center'>
            <div
                className={`w-1/2 bg-stone-900/95 rounded-xl border border-black flex flex-col items-center p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 relative shadow-3xl`}
                ref={modalBoxRef}
            >
                <button
                    onClick={() => setShowModal(false)}
                    className='absolute py-2 px-4 top-0 right-0 text-stone-300 cursor-pointer md:text-lg lg:text-xl'
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    </div>
}

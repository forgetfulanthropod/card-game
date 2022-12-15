import { useOutsideClickDismisser } from '@/hooks/useClickDismisser'
import React, { useRef, useState } from 'react'

type Tutorial = 'Cards' | 'Stance'
type Page = 1 | 2 | 3 | 4

export const TutorialModal = ({
    setShowTutorial,
}: {
    setShowTutorial: (value: React.SetStateAction<boolean>) => void
}) => {
    const modalBoxRef = useRef(null)
    useOutsideClickDismisser(modalBoxRef, setShowTutorial)
    const [currentTutorial, setCurrentTutorial] = useState<Tutorial>('Cards')
    const [page, setPage] = useState<Page>(1)

    const handleClick = () => {
        handleIncrement()
    }

    const handleLeftArrowClick = () => {
        console.log('left arrow clicked!')
    }

    const handleRightArrowClick = () => {
        handleIncrement()
    }

    const handleIncrement = () => {
        if (currentTutorial === 'Cards') {
            if (page === 4) {
                setCurrentTutorial('Stance')
                setPage(1)
                return
            }
            return setPage(page => (page + 1) as Page)
        } else if (currentTutorial === 'Stance') {
            if (page === 4) {
                return
            }
            return setPage(page => (page + 1) as Page)
        }
    }

    return <div className='bg-black/40 w-full h-full absolute z-50 text-white font-sharp pointer-events-auto'>
        <div className='flex h-full w-full justify-center items-center'>
            <div
                className='w-1/2 rounded-xl flex flex-col items-center relative'
                ref={modalBoxRef}
            >
                <img
                    src={`./assets/tutorials/${currentTutorial}${page}.png`}
                    className='scale-125'
                    onClick={handleClick}
                ></img>
                {(currentTutorial === 'Stance' || page > 1) && <img
                    src={`./assets/tutorials/LeftArrow.png`}
                    className='scale-125 absolute'
                    onClick={handleLeftArrowClick}
                ></img>}
                {(currentTutorial === 'Cards' || page < 4) && <img
                    src={`./assets/tutorials/RightArrow.png`}
                    className='scale-125 absolute'
                    onClick={handleRightArrowClick}
                ></img>}
            </div>
        </div>
    </div>
}

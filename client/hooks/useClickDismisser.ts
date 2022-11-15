import React, {
    useRef,
    useEffect,
    MutableRefObject,
    Dispatch,
    SetStateAction,
} from 'react'

/**
 * Makes any click outside the element dismiss the element. The element must be only displayed through a boolean state value, for which the setter is passed into this function.
 */
export const useOutsideClickDismisser = <T>(
    ref: MutableRefObject<HTMLElement | null>,
    setItemIsVisible: Dispatch<SetStateAction<boolean>>
) => {
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref?.current && !ref?.current?.contains(event.target)) {
                setItemIsVisible(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])
}

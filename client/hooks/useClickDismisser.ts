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
export const useOutsideClickDismisser = (
    ref: MutableRefObject<HTMLElement | null>,
    setItemIsVisible: Dispatch<SetStateAction<boolean>>,
    callback?: () => any
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref?.current && !ref?.current?.contains(event.target as Node)) {
                setItemIsVisible(false)
                callback && callback()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])
}

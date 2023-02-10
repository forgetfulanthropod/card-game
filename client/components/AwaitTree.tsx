import { getPromiseForTreeInitialized, isTreeInitialized } from '@/data'
import { FC, Fragment, Ref, RefObject } from 'react' // eslint-disable-line

import { useEffect, useRef, useState } from 'react'

type Props = {
    children: React.ReactNode
}

export const AwaitTree: FC<Props> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(isTreeInitialized())

    useEffect(() => {
        getPromiseForTreeInitialized().then(() => setIsLoaded(true))
    }, [])

    if (!isLoaded) {
        return <></>
    }

    return <>{children}</>
}

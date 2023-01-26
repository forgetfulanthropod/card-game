import { FC, Fragment, Ref, RefObject } from 'react' // eslint-disable-line

import { useEffect, useRef, useState } from 'react'

type Props = {
    children: React.ReactNode
}

export const AwaitGameState: FC<Props> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    if (!isLoaded) {
        setTimeout(() => setIsLoaded(true), 1000)
        return <></>
    }

    return <>{children}</>
}

import { h, JSX } from 'preact' // eslint-disable-line
import { createContext } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'

export function LoaderProvider(props: { children: Children }): JSX.Element {
    const [state, setState] = useState(initialState)
    const callbacks = useMemo(() => {
        return {
            basicLoaded() { setState(d => ({ ...d, isBasicLoaded: true })) },
            deluxeLoaded() { setState(d => ({ ...d, isDeluxeLoaded: true })) },
        }
    }, [])

    return <context.Provider
        value={{ ...state, ...callbacks }}>
        {props.children}
    </context.Provider>
}

export function useLoaderContext(): Value {
    console.log('useLoaderContext')
    return useContext(context)
}


const initialState = {
    isBasicLoaded: false,
    isDeluxeLoaded: false,
}
type State = typeof initialState

interface Value extends State {
    basicLoaded(): void
    deluxeLoaded(): void
}
const context = createContext<Value>(null as unknown as Value)

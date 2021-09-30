import React, { createContext, useContext, useReducer } from 'react'
import produce from 'immer'

export function LoaderProvider(props: { children: Children }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialValues)

    return <context.Provider
        value={{ ...state, dispatch }}>
        {props.children}
    </context.Provider>
}

export function useLoaderContext(): Value {
    return useContext(context)
}


type State = typeof initialValues
const initialValues = {
    isBasicLoaded: false,
    isDeluxeLoaded: false,
}

interface Value extends State {
    dispatch: React.Dispatch<Action>
}
const context = createContext<Value>(null as unknown as Value)


type Action =
    | { a: 'basicLoaded' }
    | { a: 'deluxeLoaded' }

function reducer(state: State, action: Action) {
    return produce(state, draft => {
        switch (action.a) {
            case 'basicLoaded': {
                draft.isBasicLoaded = true
                return
            } case 'deluxeLoaded': {
                draft.isDeluxeLoaded = true
                return
            } default: {
                throw Error(`unknown action ${JSON.stringify(action)}`)
            }
        }
    })
}

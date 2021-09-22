declare global {
    type Children = JSX.Element[] | JSX.Element
    type Callback = () => void
    type Setter<T> = React.Dispatch<React.SetStateAction<T>>
}

const Export = null
export default Export

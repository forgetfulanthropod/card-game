import CharacterManager from 'features/battle/components/CharacterManager'
import { JSX } from 'preact/jsx-runtime'
import { Toaster } from 'react-hot-toast'
import AppWrap from './AppWrap'


export default function App(): JSX.Element {
    return <AppWrap>
        <Toaster />
        <CharacterManager />
    </AppWrap>
}

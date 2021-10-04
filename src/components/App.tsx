import CharacterManager from 'features/battle/components/CharacterManager'
import { Toaster } from 'react-hot-toast'
import AppWrap from './AppWrap'
import type { h, JSX } from 'preact'


export default function App(): JSX.Element {
    return <AppWrap>
        <Toaster />
        <CharacterManager />
    </AppWrap>
}

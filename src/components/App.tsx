import React from 'react'
import { Toaster } from 'react-hot-toast'
import CharacterManager from 'features/battle/components/CharacterManager'
import AppWrap from './AppWrap'
import Background from '../features/battle/components/Background'


export default function App(): JSX.Element {
    return <AppWrap>
        <Background />
        <Toaster />
        <CharacterManager />
    </AppWrap>
}

import React from 'react'
import { Toaster } from 'react-hot-toast'
import CharacterManager from './CharacterManager'
import AppWrap from './AppWrap'
import Background from './Background'


export default function App(): JSX.Element {
    return <AppWrap>
        <Background />
        <Toaster />
        <CharacterManager />
    </AppWrap>
}

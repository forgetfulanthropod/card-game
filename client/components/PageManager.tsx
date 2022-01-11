import { ChakraProvider } from '@chakra-ui/react'
import { Fragment, h, JSX } from 'preact' // eslint-disable-line
import { useState } from 'preact/hooks'

import CraftPage from '@/features/craft/components/CraftPage'
import GatherGamePage from '@/features/gather/components/GatherGamePage'
import CharacterDetailPage from '@/features/marketplace/components/CharacterDetailPage'
import MarketplacePage from '@/features/marketplace/components/MarketplacePage'
import OverworldPage from '@/features/overworld/components/OverworldPage'
import QuestsPage from '@/features/quests/components/QuestsPage'
import SkilltreePage from '@/features/skilltree/SkilltreePage'
import SpawnPage from '@/features/spawn/components/SpawnPage'

import { MenuPage } from './MenuPage'
import WalletWidget from './WalletWidget'

export type ValidPage = keyof typeof nameToPage
export type PageProps = { setPage: (c: ValidPage) => void }

const nameToPage = {
    MenuPage,
    SpawnPage,
    GatherGamePage,
    OverworldPage,
    MarketplacePage,
    CharacterDetailPage,
    SkilltreePage,
    CraftPage,
    QuestsPage,
} as const

export function TempApp(): JSXElement {
    const [pageName, setPageName] =
        useState<keyof typeof nameToPage>('QuestsPage')
    const Page = nameToPage[pageName]

    // const Page = nameToPage['MenuPage']
    return <ChakraProvider>
        <WalletWidget />
        {/* <Box margin="10" padding="10"> */}
        <Page setPage={setPageName} />
        {/* <Page setPage={() => {}} /> */}
        {/* </Box> */}
    </ChakraProvider>
}

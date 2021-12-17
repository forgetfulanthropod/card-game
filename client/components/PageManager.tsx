import { ChakraProvider } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'
import { useState } from 'preact/hooks'

import GatherGamePage from '@/features/gather/components/GatherGamePage'
import MarketplacePage from '@/features/marketplace/MarketplacePage'
import OverworldPage from '@/features/overworld/components/OverworldPage'
import SkilltreePage from '@/features/skilltree/SkilltreePage'
import SpawnPage from '@/features/spawn/components/SpawnPage'

import { MenuPage } from './MenuPage'

export type ValidPage = keyof typeof nameToPage
export type PageProps = { setPage: (c: ValidPage) => void }

const nameToPage = {
    MenuPage,
    SpawnPage,
    GatherGamePage,
    OverworldPage,
    MarketplacePage,
    SkilltreePage,
} as const

export function TempApp(): JSX.Element {
    const [pageName, setPageName] = useState<keyof typeof nameToPage>('MenuPage')
    const Page = nameToPage[pageName]
    // const Page = nameToPage['MenuPage']
    return (
        <ChakraProvider>
            <Page setPage={setPageName} />
            {/* <Page setPage={() => {}} /> */}
        </ChakraProvider>
    )
}



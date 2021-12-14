import { Box, Button, ChakraProvider, Heading, SimpleGrid } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'

import GatherGamePage from '@/features/gather/components/GatherGamePage'
import SpawnPage from '@/features/spawn/components/SpawnPage'

type ValidPage = keyof typeof nameToPage
export type PageProps = { setPage: (c: ValidPage) => void }

const nameToPage = {
    MenuPage,
    SpawnPage,
    GatherGamePage,
} as const

export function TempApp(): JSX.Element {
    const [pageName, setPageName] = useState<keyof typeof nameToPage>('GatherGamePage')
    const Page = nameToPage[pageName]
    // const Page = nameToPage['MenuPage']
    return (
        <ChakraProvider>
            <Page setPage={setPageName} />
            {/* <Page setPage={() => {}} /> */}
        </ChakraProvider>
    )
}

export function PageHeader(props: { setPage: (c: ValidPage) => void }): JSX.Element {
    return (
        <Box margin={'20px'} width={'20em'}>
            <MyButton onClick={() => props.setPage('MenuPage')} text={'Home'} />
        </Box>
    )
}

function MenuPage(props: PageProps) {
    return (
        <>
            <Heading>Kaiju Cards Wireframes!</Heading>
            <PageHeader setPage={props.setPage} />
            <SimpleGrid columns={2} spacing={10} margin={'20px'}>
                <MyButton text={'battle ❌'} />
                <MyButton text={'craft ❌'} />
                <MyButton text={'spawn ✔️'} onClick={() => props.setPage('SpawnPage')} />
                <MyButton text={'gather idle ❌'} />
                <MyButton text={'gather minigames ᠁'} onClick={() => props.setPage('GatherGamePage')} />
                <MyButton text={'marketplace ❌'} />
                <MyButton text={'skill tree ❌'} />
                <MyButton text={'refining ❌'} />
                <MyButton text={'lending ❌'} />
                <MyButton text={'wallet tools ❌'} />
            </SimpleGrid>
        </>
    )
}

function MyButton(props: { text: string; onClick?: () => void }): JSX.Element {
    return (
        <Button colorScheme="blue" height="90px" fontSize={'2em'} onClick={props.onClick}>
            {props.text}
        </Button>
    )
}

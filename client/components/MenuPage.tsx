import { Heading, SimpleGrid } from '@chakra-ui/react'
import { Fragment, h } from 'preact'

import { MyButton, PageHeader } from './PageHeader'
import type { PageProps } from './PageManager'

export function MenuPage(props: PageProps): JSX.Element {
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
                <MyButton text={'marketplace ✔️'} onClick={() => props.setPage('MarketplacePage')} />
                <MyButton text={'skill tree ᠁'} onClick={() => props.setPage('SkilltreePage')} />
                <MyButton text={'refining ❌'} />
                <MyButton text={'lending ❌'} />
                <MyButton text={'wallet tools ❌'} />
                <MyButton text={'overworld ✔️'} onClick={() => props.setPage('OverworldPage')} />
            </SimpleGrid>
        </>
    )
}

/*eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsForRegex": ["^mut"] }]*/

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
                <MyButton
                    text={'Character Details'}
                    onClick={() => props.setPage('CharacterDetailPage')}
                />
                <MyButton
                    text={'QUESTS ᠁'}
                    onClick={() => props.setPage('QuestsPage')}
                />
                <MyButton text={'battle ❌'} />
                <MyButton
                    text={'craft ✔️'}
                    onClick={() => props.setPage('CraftPage')}
                />
                <MyButton
                    text={'spawn ✔️'}
                    onClick={() => props.setPage('SpawnPage')}
                />
                <MyButton text={'gather idle ❌'} />
                <MyButton
                    text={'gather minigames ᠁'}
                    onClick={() => props.setPage('GatherGamePage')}
                />
                <MyButton
                    text={'marketplace ✔️'}
                    onClick={() => props.setPage('MarketplacePage')}
                />
                <MyButton
                    text={'skill tree ✔️'}
                    onClick={() => props.setPage('SkilltreePage')}
                />
                <MyButton text={'refining ❌'} />
                <MyButton text={'lending ❌'} />
                <MyButton text={'wallet tools ❌'} />
                <MyButton
                    text={'overworld ✔️'}
                    onClick={() => props.setPage('OverworldPage')}
                />
            </SimpleGrid>
        </>
    )
}

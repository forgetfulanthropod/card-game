import { Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'
export default function CharacterDetailPage(props: PageProps): JSX.Element {
    return (
        <>
            <Heading>Marketplace Character Details</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>Character details go here</Text>
        </>
    )
}

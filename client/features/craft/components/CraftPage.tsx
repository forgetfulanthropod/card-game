import { Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

export default function CraftPage(props: PageProps): JSX.Element {
    return (
        <>
            <Heading>Crafting page</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>We'll see...</Text>
        </>
    )
}

import { Heading } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'

import type { PageProps } from '@/components/TempApp'
import { PageHeader } from '@/components/TempApp'

export default function SpawnPage(props: PageProps): JSX.Element {
    return (
        <>
            <Heading>Spawn page</Heading>
            <PageHeader setPage={props.setPage} />
        </>
    )
}

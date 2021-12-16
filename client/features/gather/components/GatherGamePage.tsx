import { Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'

import type { PageProps } from '@/components/TempApp'
import { PageHeader } from '@/components/TempApp'
export default function GatherGamePage(props: PageProps): JSX.Element {
    return (
        <>
            <Heading>Gather minigame page</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>I almost had a couple minigames here from codepens but it kept crashing the page</Text>
        </>
    )
}

import { Heading, Text } from '@chakra-ui/react'
import { Fragment } from 'preact'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'
export default function GatherGamePage(props: PageProps): JSXElement {
    return (
        <>
            <Heading>Gather minigame page</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>
                I almost had a couple minigames here from codepens but it kept
                crashing the page
            </Text>
        </>
    )
}

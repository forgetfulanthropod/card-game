import { Button, ButtonGroup, Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

export default function QuestsPage(props: PageProps): JSX.Element {
    const [subpage, setSubpage] = useState()
    return (
        <>
            <Heading>Genesis Quests</Heading>
            <PageHeader setPage={props.setPage} />
            <ButtonGroup variant="outline" spacing="2">
                <Button colorScheme="blue">Intro</Button>
                <Button colorScheme="red">Choose your character</Button>
                <Button colorScheme="green">Quest</Button>
            </ButtonGroup>
            <Text>Genesis quests are the bests</Text>
        </>
    )
}

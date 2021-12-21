import { Button, ButtonGroup, Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

const subpages = { Intro, Choose, Quest }

export default function QuestsPage(props: PageProps): JSX.Element {
    const [subpage, setSubpage] = useState<keyof typeof subpages>('Intro')
    const Subpage = subpages[subpage]
    return (
        <>
            <Heading>Genesis Quests</Heading>
            <PageHeader setPage={props.setPage} />
            <ButtonGroup variant="outline" spacing="2">
                <Button onClick={() => setSubpage('Intro')} colorScheme="blue">
                    Intro
                </Button>
                <Button onClick={() => setSubpage('Choose')} colorScheme="red">
                    Choose your character
                </Button>
                <Button onClick={() => setSubpage('Quest')} colorScheme="green">
                    Quest
                </Button>
            </ButtonGroup>
            <Text>Genesis quests are the genesis bests</Text>
            <Subpage />
        </>
    )
}

function Intro() {
    return (
        <>
            <Heading size="lg">Intro</Heading>
        </>
    )
}

function Choose() {
    return (
        <>
            <Heading size="lg">Choose your character</Heading>
        </>
    )
}

function Quest() {
    return (
        <>
            <Heading size="lg">Quest!</Heading>
        </>
    )
}

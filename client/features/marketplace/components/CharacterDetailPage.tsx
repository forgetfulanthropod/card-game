import { Box, Heading, Image, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

import { ChainLightning, Dispel, MagicMirrorV2 } from '../assets/Wizard'
export default function CharacterDetailPage(props: PageProps): JSX.Element {
    return (
        <Box overflowY={'scroll'} position="fixed" top={0} left={0} right={0} bottom={0}>
            <Heading>Marketplace Character Details</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>Character details go here</Text>
            <Image src={ChainLightning} />
            <Image src={Dispel} />
            <Image src={MagicMirrorV2} />
        </Box>
    )
}

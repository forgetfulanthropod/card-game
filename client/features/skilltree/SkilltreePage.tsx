import { Box, Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

import type { PageProps } from '@/components/TempApp'
import { PageHeader } from '@/components/TempApp'

import MySkilltree from './MySkilltree'

export default function SkilltreePage(props: PageProps): JSX.Element {
    return (
        <Box overflowY={'scroll'} position="fixed" top={0} left={0} right={0} bottom={0}>
            <Heading>Skilltree page</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>This is using library {"'beautiful-skill-tree'"}</Text>
            <MySkilltree />
        </Box>
    )
}

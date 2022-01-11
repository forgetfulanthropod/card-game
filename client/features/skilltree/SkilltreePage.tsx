import { Box, Heading, Text } from '@chakra-ui/react'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

import MySkilltree from './MySkilltree'

export default function SkilltreePage(props: PageProps): JSXElement {
    return <Box
        overflowY={'scroll'}
        position='fixed'
        top={0}
        left={0}
        right={0}
        bottom={0}
    >
        <Heading>Skilltree page</Heading>
        <PageHeader setPage={props.setPage} />
        <Text>This is using library {"'beautiful-skill-tree'"}</Text>
        <MySkilltree />
    </Box>
}

import { Heading, Text } from '@chakra-ui/react'
import { Fragment } from 'preact'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'

import { attachViewport } from './attachViewport'
export default function OverworldPage(props: PageProps): JSXElement {
    return (
        <>
            <Heading>Overworld page</Heading>
            <PageHeader setPage={props.setPage} />
            <Text>Just pan and zoom, no click action yet</Text>
            <canvas
                width={window.innerWidth / 2}
                height={window.innerHeight / 2}
                ref={node => node != null && attachViewport({ canvas: node })}
            />
        </>
    )
}

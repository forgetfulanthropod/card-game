import { Heading, Text } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { Fragment, h } from 'preact'

import type { PageProps } from '@/components/TempApp'
import { PageHeader } from '@/components/TempApp'

import { attachViewport } from './attachViewport'
export default function OverworldPage(props: PageProps): JSX.Element {
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

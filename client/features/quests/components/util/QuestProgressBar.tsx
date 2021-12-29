import { Heading, Progress, VStack } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function QuestProgressBar(props: { percent: number; title: string }): JSX.Element {
    return (
        <VStack bg="gray.100" p="10px" m="2px" borderRadius="2px">
            <Heading>{props.title}</Heading>
            <Progress value={props.percent} size="lg" width="100%" bg="gray.400" />
        </VStack>
    )
}
export function QuestProgressBarExample(): JSX.Element {
    return <QuestProgressBar percent={75} title="Save Eden Village" />
}

import { Heading, Progress, VStack } from '@chakra-ui/react'

export default function QuestProgressBar(props: {
    percent: number
    title: string
}): JSXElement {
    return <VStack bg='gray.100' p='10px' m='2px' borderRadius='2px'>
        <Heading>{props.title}</Heading>
        <Progress value={props.percent} size='lg' width='100%' bg='gray.400' />
    </VStack>
}
export function QuestProgressBarExample(): JSXElement {
    return <QuestProgressBar percent={75} title='Save Eden Village' />
}

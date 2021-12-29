import { Box, Button } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function QuestProgressBar(): JSX.Element {
    return (
        <Box>
            <Button>QuestProgressBar</Button>
        </Box>
    )
}
export function QuestProgressBarExample(): JSX.Element {
    return <QuestProgressBar />
}

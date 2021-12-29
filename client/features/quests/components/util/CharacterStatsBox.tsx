import { Box, Button } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function CharacterStatsBox(): JSX.Element {
    return (
        <Box>
            <Button>CharacterStatsBox</Button>
        </Box>
    )
}
export function CharacterStatsBoxExample(): JSX.Element {
    return <CharacterStatsBox />
}

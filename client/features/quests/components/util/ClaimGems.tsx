import { Box, Button } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function ClaimGems(): JSX.Element {
    return (
        <Box>
            <Button>Claim Gems</Button>
        </Box>
    )
}
export function ClaimGemsExample(): JSX.Element {
    return <ClaimGems />
}

import { Box, Button } from '@chakra-ui/react'

export default function ClaimGems(): JSXElement {
    return (
        <Box>
            <Button bg='#01ffff'>💎 Claim Gems 💎</Button>
        </Box>
    )
}
export function ClaimGemsExample(): JSXElement {
    return <ClaimGems />
}

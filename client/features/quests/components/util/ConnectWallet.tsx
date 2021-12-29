import { Box, Button } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function ConnectWallet(): JSX.Element {
    return (
        <Box>
            <Button>ConnectWallet</Button>
        </Box>
    )
}
export function ConnectWalletExample(): JSX.Element {
    return <ConnectWallet />
}

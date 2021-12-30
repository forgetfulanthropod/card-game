import { Box, Button, Image } from '@chakra-ui/react'
import type { JSX } from 'preact'

import solanaSvg from '@/features/quests/assets/solanaLogoMark.svg'

export default function ConnectWallet(): JSX.Element {
    return (
        <Box>
            <Button>
                <Image src={solanaSvg} maxH='50%' mr='10px' ml='10px' />
                Connect Wallet
            </Button>
        </Box>
    )
}
export function ConnectWalletExample(): JSX.Element {
    return <ConnectWallet />
}

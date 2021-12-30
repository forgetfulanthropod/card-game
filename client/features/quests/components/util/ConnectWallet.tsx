import { Box, Button, Image } from '@chakra-ui/react'

import solanaSvg from '@/features/quests/assets/solanaLogoMark.svg'

export default function ConnectWallet(): JSXElement {
    return (
        <Box>
            <Button>
                <Image src={solanaSvg} maxH='50%' mr='10px' ml='10px' />
                Connect Wallet
            </Button>
        </Box>
    )
}
export function ConnectWalletExample(): JSXElement {
    return <ConnectWallet />
}

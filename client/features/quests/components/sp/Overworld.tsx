import { Box, Image } from '@chakra-ui/react'

import mapJpg from '@/features/quests/assets/high-res-map.jpg'

export default function Overworld(): JSXElement {
    return <Box>
        Overworld
        <Image src={mapJpg} w={400} />
    </Box>
}

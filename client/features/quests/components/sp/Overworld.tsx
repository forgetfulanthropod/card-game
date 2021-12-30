import { Box, Image } from '@chakra-ui/react'
import type { JSX } from 'preact'

import mapJpg from '@/features/quests/assets/high-res-map.jpg'

export default function Overworld(): JSX.Element {
    return (
        <Box>
            Overworld
            <Image src={mapJpg} w={400} />
        </Box>
    )
}

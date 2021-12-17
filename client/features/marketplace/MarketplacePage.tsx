import { Box, Button, Heading } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

import { PageHeader } from '@/components/PageHeader'
import type { PageProps } from '@/components/PageManager'
import mimic from '@/features/battle/assets/cards/mimic-200.png'
import mush from '@/features/battle/assets/cards/Mushroom_Farmer2-200.png'
import peng from '@/features/battle/assets/cards/PenguinKnight-200.png'
import snacky from '@/features/battle/assets/cards/Snacky-200.png'
import ChakraTable from '@/features/spawn/components/ChakraTable'

export default function MarketplacePage(props: PageProps): JSX.Element {
    const tableData = [
        ['Image', 'name', 'price', 'buy', 'glass', 'cook', 'rock', 'widely'],
        [<img key={mimic} src={mimic} />, 'mimic', '11 SOL', <Button key={'mimic'}>Buy</Button>, 1, 70, 83, 37],
        [<img key={mimic} src={mimic} />, 'mimic', '19 SOL', <Button key={'mimic'}>Buy</Button>, 54, 69, 3, 39],
        [<img key={mimic} src={mimic} />, 'mimic', '4 SOL', <Button key={'mimic'}>Buy</Button>, 99, 78, 13, 23],
        [<img key={mush} src={mush} />, 'mush', '10 SOL', <Button key={'mush'}>Buy</Button>, 97, 92, 89, 70],
        [<img key={mush} src={mush} />, 'mush', '14 SOL', <Button key={'mush'}>Buy</Button>, 31, 2, 8, 46],
        [<img key={peng} src={peng} />, 'peng', '16 SOL', <Button key={'peng'}>Buy</Button>, 72, 73, 50, 67],
        [<img key={mimic} src={mimic} />, 'mimic', '6 SOL', <Button key={'mimic'}>Buy</Button>, 55, 67, 9, 38],
        [<img key={snacky} src={snacky} />, 'snacky', '5 SOL', <Button key={'snacky'}>Buy</Button>, 14, 63, 12, 3],
        [<img key={snacky} src={snacky} />, 'snacky', '12 SOL', <Button key={'snacky'}>Buy</Button>, 7, 65, 84, 9],
    ]
    return (
        <Box overflowY={'scroll'} position="fixed" top={0} left={0} right={0} bottom={0}>
            <Heading>Marketplace page</Heading>
            <PageHeader setPage={props.setPage} />
            <Button fontSize={'2em'} padding={'1em'} margin="1em" onClick={() => alert('unimplemented')}>
                List my kaiju for sale
            </Button>
            <ChakraTable data={tableData} />
        </Box>
    )
}

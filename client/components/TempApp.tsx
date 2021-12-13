import { Button, ChakraProvider, Heading, SimpleGrid } from '@chakra-ui/react'
import { h } from 'preact' // eslint-disable-line

export function TempApp(): JSX.Element {
    return (
        <ChakraProvider>
            <Heading>Kaiju Cards Wireframes!</Heading>
            <SimpleGrid columns={2} spacing={10} margin={'20px'}>
                <MyButton text={'battle'} />
                <MyButton text={'craft'} />
                <MyButton text={'spawn'} />
                <MyButton text={'gather idle'} />
                <MyButton text={'gather minigame'} />
                <MyButton text={'marketplace'} />
                <MyButton text={'skill tree'} />
                <MyButton text={'refining'} />
                <MyButton text={'lending'} />
                <MyButton text={'wallet tools'} />
            </SimpleGrid>
        </ChakraProvider>
    )
}
function MyButton(props: { text: string }) {
    return (
        <Button colorScheme="blue" height="90px" fontSize={'2em'}>
            {props.text}
        </Button>
    )
}

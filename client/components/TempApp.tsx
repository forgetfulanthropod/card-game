import { Button, ChakraProvider } from '@chakra-ui/react'
import { h } from 'preact' // eslint-disable-line

export function TempApp(): JSX.Element {
    return (
        <div>
            <h1>This is a header</h1>
            <button>Ordinary button</button>
            <ChakraProvider>
                <Button colorScheme="blue">Chakra button</Button>
            </ChakraProvider>
        </div>
    )
}

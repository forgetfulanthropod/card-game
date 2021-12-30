import { Box, Button } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function FormYourPartyPrompt(): JSX.Element {
    return (
        <Box>
            <Button
                fontSize='xx-large'
                margin='1em'
                padding='1em'
                bg='black'
                color='white'
                boxShadow='10px 5px 5px gray'
                _hover={{ bg: 'darkgray' }}
            >
                FORM YOUR PARTY
            </Button>
        </Box>
    )
}
export function FormYourPartyPromptExample(): JSX.Element {
    return <FormYourPartyPrompt />
}

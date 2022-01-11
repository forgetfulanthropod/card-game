import { Box, Button } from '@chakra-ui/react'

export default function FormYourPartyPrompt(): JSXElement {
    return <Box>
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
}
export function FormYourPartyPromptExample(): JSXElement {
    return <FormYourPartyPrompt />
}

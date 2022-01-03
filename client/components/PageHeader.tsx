import { Box, Button } from '@chakra-ui/react'

import type { ValidPage } from './PageManager'

export function PageHeader(props: {
    setPage: (c: ValidPage) => void
}): JSXElement {
    return (
        <Box margin={'20px'} width={'20em'}>
            <MyButton onClick={() => props.setPage('MenuPage')} text={'Home'} />
        </Box>
    )
}

export function MyButton(props: {
    text: string
    onClick?: () => void
}): JSXElement {
    return (
        <Button
            colorScheme='blue'
            height='90px'
            fontSize={'2em'}
            onClick={props.onClick}
        >
            {props.text}
        </Button>
    )
}

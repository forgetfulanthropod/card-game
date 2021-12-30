import { Box, Button } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

import type { ValidPage } from './PageManager'

export function PageHeader(props: {
    setPage: (c: ValidPage) => void
}): JSX.Element {
    return (
        <Box margin={'20px'} width={'20em'}>
            <MyButton onClick={() => props.setPage('MenuPage')} text={'Home'} />
        </Box>
    )
}

export function MyButton(props: {
    text: string
    onClick?: () => void
}): JSX.Element {
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

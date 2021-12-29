import { Box, Heading, Table, Td, Tr } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function UITour(): JSX.Element {
    return (
        <Box>
            <Heading>UI Tour</Heading>
            <Table>
                <Tr>
                    <Td>Claim gems</Td>
                    <Td></Td>
                </Tr>
                <Tr>
                    <Td>Connect wallet</Td>
                    <Td></Td>
                </Tr>
                <Tr>
                    <Td>Character stats box</Td>
                    <Td></Td>
                </Tr>
                <Tr>
                    <Td>Quest progress bar</Td>
                    <Td></Td>
                </Tr>
                <Tr>
                    <Td>Form-your-party prompt</Td>
                    <Td></Td>
                </Tr>
            </Table>
        </Box>
    )
}

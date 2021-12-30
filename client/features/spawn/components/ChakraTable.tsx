import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { range } from 'lodash'
import { h, JSX } from 'preact'

export default function ChakraTable(props: {
    data: (string | number | JSX.Element)[][]
}): JSX.Element {
    return (
        <Table variant='simple'>
            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
            <Thead>
                <Tr>
                    {props.data[0].map(s => (
                        <Th key={s.toString()}>{s}</Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {range(1, props.data.length).map(i => (
                    <Tr key={i}>
                        {props.data[i].map(s => (
                            <Td key={s.toString()}>{s}</Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
            {/* <Tfoot> <Tr> <Th>To convert</Th> <Th>into</Th> <Th isNumeric>multiply by</Th> </Tr> </Tfoot> */}
        </Table>
    )
}

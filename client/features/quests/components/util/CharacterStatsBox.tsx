import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

export default function CharacterStatsBox(props: { strength: number; rarity: string; ownedSince: Date }): JSX.Element {
    const data: [string, any][] = [
        ['strength', props.strength],
        ['rarity', props.rarity],
        ['owned since', props.ownedSince.toLocaleDateString()],
    ]
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Stat</Th>
                    <Th>Value</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map(([stat, value]) => (
                    <Tr key={stat}>
                        <Td>{stat}</Td>
                        <Td>{value}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}
export function CharacterStatsBoxExample(): JSX.Element {
    return <CharacterStatsBox strength={5} rarity="common" ownedSince={new Date()} />
}

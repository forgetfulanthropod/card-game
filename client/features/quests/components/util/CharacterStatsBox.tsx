import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

export default function CharacterStatsBox(props: {
    strength: number
    rarity: string
    ownedSince: Date
}): JSXElement {
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
export function CharacterStatsBoxExample(): JSXElement {
    return (
        <CharacterStatsBox
            strength={5}
            rarity='common'
            ownedSince={new Date()}
        />
    )
}

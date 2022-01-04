import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

// import HackingMinigame from '../hacking/HackingMinigame'
import { CharacterStatsBoxExample } from '../util/CharacterStatsBox'
import { ClaimGemsExample } from '../util/ClaimGems'
import { ConnectWalletExample } from '../util/ConnectWallet'
import { FormYourPartyPromptExample } from '../util/FormYourPartyPrompt'
import { QuestProgressBarExample } from '../util/QuestProgressBar'

export default function UITour(): JSXElement {
    // return <HackingMinigame />
    return (
        <Box>
            <Heading>UI Tour</Heading>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Purpose of UI component</Th>
                        <Th>Example</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Claim gems</Td>
                        <Td>
                            <ClaimGemsExample />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Connect wallet</Td>
                        <Td>
                            <ConnectWalletExample />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Character stats box</Td>
                        <Td>
                            <CharacterStatsBoxExample />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Quest progress bar</Td>
                        <Td>
                            <QuestProgressBarExample />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Form-your-party prompt</Td>
                        <Td>
                            <FormYourPartyPromptExample />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>View collected assets</Td>
                        <Td></Td>
                    </Tr>
                    <Tr>
                        <Td>NPC dialogue popup</Td>
                        <Td></Td>
                    </Tr>
                    <Tr>
                        <Td>New user tour arrow</Td>
                        <Td></Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

// ClaimGems
// ConnectWallet
// CharacterStatsBox
// QuestProgressBar
// FormYourPartyPrompt

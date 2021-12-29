import { Box, Heading, Table, Td, Tr } from '@chakra-ui/react'
import type { JSX } from 'preact'
import { h } from 'preact'

import { CharacterStatsBoxExample } from '../util/CharacterStatsBox'
import { ClaimGemsExample } from '../util/ClaimGems'
import { ConnectWalletExample } from '../util/ConnectWallet'
import { FormYourPartyPromptExample } from '../util/FormYourPartyPrompt'
import { QuestProgressBarExample } from '../util/QuestProgressBar'

export default function UITour(): JSX.Element {
    return (
        <Box>
            <Heading>UI Tour</Heading>
            <Table>
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
            </Table>
        </Box>
    )
}

// ClaimGems
// ConnectWallet
// CharacterStatsBox
// QuestProgressBar
// FormYourPartyPrompt

import { SiweMessage } from 'siwe'
import { WalletAddress } from '..'

export const generateDummyWalletAddress = (): string => {
    const addressLength = 40 // Ethereum address length excluding '0x' prefix
    const hexChars = '0123456789abcdef'
    let address = '0x'

    // Generate random hex characters until the address is the correct length
    while (address.length < addressLength + 2) {
        const randomIndex = Math.floor(Math.random() * hexChars.length)
        address += hexChars[randomIndex]
    }

    return address
}

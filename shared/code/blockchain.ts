// removed all crypto/wallet code. simple id shortener for display
export const getShortAccountId = (id: string) => {
    if (!id) return '???'
    return id.length > 8 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id
}

// legacy alias
export const getShortWalletAddress = getShortAccountId

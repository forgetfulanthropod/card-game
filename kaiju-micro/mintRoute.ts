import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import web3, { Connection } from '@solana/web3.js'

import { app, mintToken, secretKey } from './index'

app.post('/mint', async function (req, res) {
    //res.send('POST request to the homepage')
    const data = req.body
    //console.log(data)
    //console.log(data["amount"])
    const mintTokens = async (data: { amount: number }) => {
        console.log('data', data)

        const amount = data['amount']
        const connection = new Connection(web3.clusterApiUrl('devnet'))
        //console.log(connection)
        const fromWallet = web3.Keypair.fromSecretKey(secretKey)

        const myMint = new web3.PublicKey(mintToken)

        const myToken = new Token(
            connection,
            myMint,
            TOKEN_PROGRAM_ID,
            fromWallet // guy who pays to create new accounts.
        )

        const fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
            fromWallet.publicKey
        )

        await myToken.mintTo(
            fromTokenAccount.address,
            fromWallet.publicKey,
            [],
            amount
        )
    }

    await mintTokens(data)
    res.send('ok')
    // return remaining tokens
})

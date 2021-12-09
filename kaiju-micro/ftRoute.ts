import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import web3, { Connection } from '@solana/web3.js'

import { app, mintToken, secretKey } from './index'

app.post('/ft', async function (req, res) {
    //res.send('POST request to the homepage')
    const data = req.body
    console.log(data)
    //console.log(data["amount"])
    const transferTokens = async (data: { toAddress: string; amount: number }) => {
        console.log('data', data)
        const toAddress = data['toAddress']
        const amount = data['amount']
        const connection = new Connection(web3.clusterApiUrl('devnet'))
        //console.log(connection)
        const fromWallet = web3.Keypair.fromSecretKey(secretKey)

        //console.log(fromWallet, toWallet)
        // Construct my token class
        const myMint = new web3.PublicKey(mintToken)

        const myToken = new Token(
            connection,
            myMint,
            TOKEN_PROGRAM_ID,
            fromWallet // guy who pays to create new accounts.
        )

        //console.log("tok", myToken)
        // FAILURE HERE
        // Create associated token accounts for my token if they don't exist yet
        const fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(fromWallet.publicKey)
        //console.log("A", fromTokenAccount)
        const toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(new web3.PublicKey(toAddress))

        //console.log("B", toTokenAccount)
        // Add token transfer instructions to transaction
        const transaction = new web3.Transaction().add(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                [],
                amount
            )
        )

        // Sign transaction, broadcast, and confirm
        const signature = await web3.sendAndConfirmTransaction(connection, transaction, [fromWallet])
        console.log('SIGNATURE', signature)
        console.log('SUCCESS')
    }

    await transferTokens(data)
    res.send('ok')
    // return remaining tokens
})

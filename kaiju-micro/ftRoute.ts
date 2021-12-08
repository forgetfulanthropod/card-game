import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import web3, { Connection } from '@solana/web3.js'
import { app, secretKey, mintToken } from './index'

app.post('/ft', function (req, res) {
    //res.send('POST request to the homepage')
    var data = req.body
    console.log(data)
    //console.log(data["amount"])
    var transferTokens = async (data: { toAddress: string; amount: number }) => {
        console.log('data', data)
        let toAddress = data['toAddress']
        let amount = data['amount']
        let connection = new Connection(web3.clusterApiUrl('devnet'))
        //console.log(connection)
        var fromWallet = web3.Keypair.fromSecretKey(secretKey)

        //console.log(fromWallet, toWallet)
        // Construct my token class
        var myMint = new web3.PublicKey(mintToken)

        var myToken = new Token(
            connection,
            myMint,
            TOKEN_PROGRAM_ID,
            fromWallet // guy who pays to create new accounts.
        )

        //console.log("tok", myToken)
        // FAILURE HERE
        // Create associated token accounts for my token if they don't exist yet
        var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(fromWallet.publicKey)
        //console.log("A", fromTokenAccount)
        var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(new web3.PublicKey(toAddress))

        //console.log("B", toTokenAccount)
        // Add token transfer instructions to transaction
        var transaction = new web3.Transaction().add(
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
        var signature = await web3.sendAndConfirmTransaction(connection, transaction, [fromWallet])
        console.log('SIGNATURE', signature)
        console.log('SUCCESS')
    }

    transferTokens(data).then(() => res.send('ok'))
    // return remaining tokens
})

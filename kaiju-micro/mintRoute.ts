import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import web3, { Connection } from '@solana/web3.js'
import { app, secretKey, mintToken } from './index'

app.post('/mint', function (req, res) {
    //res.send('POST request to the homepage')
    var data = req.body
    //console.log(data)
    //console.log(data["amount"])
    var mintTokens = async (data: { amount: number }) => {
        console.log('data', data)

        let amount = data['amount']
        let connection = new Connection(web3.clusterApiUrl('devnet'))
        //console.log(connection)
        var fromWallet = web3.Keypair.fromSecretKey(secretKey)

        var myMint = new web3.PublicKey(mintToken)

        var myToken = new Token(
            connection,
            myMint,
            TOKEN_PROGRAM_ID,
            fromWallet // guy who pays to create new accounts.
        )

        let fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(fromWallet.publicKey)

        await myToken.mintTo(fromTokenAccount.address, fromWallet.publicKey, [], amount)
    }

    mintTokens(data).then(() => res.send('ok'))
    // return remaining tokens
})

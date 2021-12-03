const express = require('express')
const app = express()
const port = 3001

const bs58 = require('bs58');


const web3 = require('@solana/web3.js');
const {sendAndConfirmTransaction, clusterApiUrl, Connection} = require("@solana/web3.js");

const {splToken, Token, TOKEN_PROGRAM_ID} = require("@solana/spl-token");

let secretKey = Uint8Array.from([
  170,240,169,213,84,142,67,182,168,158,199,115,204,104,53,101,248,130,251,238,190,42,194,252,140,178,129,145,225,152,119,21,228,64,82,55,93,74,194,217,55,176,110,147,248,203,26,36,222,211,119,239,85,125,66,146,223,67,112,142,62,168,86,187
]);

let mintToken = "CEcD7gFAA6sgMbZ6xCJAhhavgBJs7Ay69okUoCXqoHcb"

//console.log(bs58.encode(secretKey))

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/mint', function (req, res) {
  //res.send('POST request to the homepage')
  var data = req.body
  //console.log(data)
  //console.log(data["amount"])
  
  var mintTokens = (async (data) => {
    console.log("data", data)
    
    let amount = data["amount"]
    let connection = new Connection(web3.clusterApiUrl("devnet"));
    //console.log(connection)
    var fromWallet = web3.Keypair.fromSecretKey(secretKey);

    var myMint = new web3.PublicKey(mintToken);

    var myToken = new Token(
      connection,
      myMint,
      TOKEN_PROGRAM_ID,
      fromWallet // guy who pays to create new accounts.
    );

    let fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      fromWallet.publicKey,
    );
    
    await myToken.mintTo(fromTokenAccount.address, fromWallet.publicKey, [], amount);

  });

  mintTokens(data).then(res.send("ok"))
  // return remaining tokens
})

app.post('/ft', function (req, res) {
  //res.send('POST request to the homepage')
  var data = req.body
  console.log(data)
  //console.log(data["amount"])
  
  var transferTokens = (async (data) => {
    console.log("data", data)
    let toAddress = data["toAddress"]
    let amount = data["amount"]
    let connection = new Connection(web3.clusterApiUrl("devnet"));
    //console.log(connection)
    var fromWallet = web3.Keypair.fromSecretKey(secretKey);
    

    //console.log(fromWallet, toWallet)
    // Construct my token class

    var myMint = new web3.PublicKey(mintToken);


    var myToken = new Token(
      connection,
      myMint,
      TOKEN_PROGRAM_ID,
      fromWallet // guy who pays to create new accounts.
    );

    //console.log("tok", myToken)
    // FAILURE HERE
    // Create associated token accounts for my token if they don't exist yet
    var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      fromWallet.publicKey
    )
    //console.log("A", fromTokenAccount)

    var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      new web3.PublicKey(toAddress)
    )

    //console.log("B", toTokenAccount)
    // Add token transfer instructions to transaction
    var transaction = new web3.Transaction()
      .add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          fromWallet.publicKey,
          [],
          amount
        )
      );

      // Sign transaction, broadcast, and confirm
      var signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet]
      );
      console.log("SIGNATURE", signature);
      console.log("SUCCESS");
  });

  transferTokens(data).then(res.send("ok"))
  // return remaining tokens
})

app.listen(port, () => {
  console.log(`Microservice listening at http://localhost:${port}`)
})

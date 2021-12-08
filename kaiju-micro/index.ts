//console.log(bs58.encode(secretKey))
import bodyParser from 'body-parser'
import express from 'express'
export const app = express()
const port = 3001

export let secretKey = Uint8Array.from([
    170, 240, 169, 213, 84, 142, 67, 182, 168, 158, 199, 115, 204, 104, 53, 101, 248, 130, 251, 238, 190, 42, 194, 252,
    140, 178, 129, 145, 225, 152, 119, 21, 228, 64, 82, 55, 93, 74, 194, 217, 55, 176, 110, 147, 248, 203, 26, 36, 222,
    211, 119, 239, 85, 125, 66, 146, 223, 67, 112, 142, 62, 168, 86, 187,
])

export let mintToken = 'CEcD7gFAA6sgMbZ6xCJAhhavgBJs7Ay69okUoCXqoHcb'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`)
})

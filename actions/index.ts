import express from 'express'
export const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/hi', (req, res) => {
    res.send('hi there')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

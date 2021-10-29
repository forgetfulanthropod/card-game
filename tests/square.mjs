import assert from 'assert'
import axios from 'axios'
// import { test, runTests } from './framework.mjs'
test('test the testing library', () => {
    assert.equal(1 + 2, 3)
})

test('(axios) square of 7 is 49', async () => {
    const result = await axios.post(`http://localhost:3000/square`, { n: 7 })
    assert.equal(result.data.status, 'success')
    assert.equal(result.data.result, 49)
})

// runTests()

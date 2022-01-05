import { expect, Test, TestSuite } from 'testyts'

import { five } from './index'

@TestSuite()
export class FiveTestSuite {
    @Test()
    five() {
        expect.toBeEqual(five(), 5)
    }
}

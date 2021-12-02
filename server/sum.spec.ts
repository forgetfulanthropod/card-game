import { expect,Test, TestSuite } from 'testyts'

import { sum } from './sum'
@TestSuite()
export class MyTestSuite {
    @Test()
    onePlusOne(): void {
        // Act
        const result = 1 + 1

        // Assert
        expect.toBeEqual(result, 2)
    }
    @Test()
    twoPlusThree(): void {
        expect.toBeEqual(sum(2, 3), 5)
    }
}

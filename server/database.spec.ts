import { expect, Test, TestSuite } from 'testyts'
import { isDeepStrictEqual } from 'util'

import { deleteUser, hasUser, readUser, setUser } from './database'

@TestSuite()
export class DatabaseTestSuite {
    @Test()
    async fullDbTest(): Promise<void> {
        // Act
        const username = 'tom'
        // await initializeDb()
        const gs = { a: 1, b: { c: { d: 2 } } }
        // const gs = getInitialGameState(username)
        await deleteUser(username)
        expect.toBeFalse(await hasUser(username))
        // @ts-ignore
        await setUser(username, gs)
        expect.toBeTrue(await hasUser(username))
        // @ts-ignore
        expect.toBeTrue(isDeepStrictEqual(await readUser(username), gs))
        await deleteUser(username)
        expect.toBeFalse(await hasUser(username))
    }
}

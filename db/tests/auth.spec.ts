import { AceBaseClient } from 'acebase-client'
import { expect, Test, TestSuite, BeforeAll, AfterAll } from 'testyts'

const username = 'ewout'
const pass1 = 'TooEasy4U?'
const pass2 = 'TooHard4U?'

@TestSuite()
export class AuthorizationTestSuite {
    db!: AceBaseClient
    @BeforeAll()
    async beforeAll() {
        this.db = new AceBaseClient({
            host: 'localhost',
            port: 5757,
            dbname: 'mydb',
            https: false,
        })
        // @ts-ignore
        await this.db.ready()
        console.log('Connected successfully')
    }

    @Test()
    async signup() {
        console.log('signing into admin')
        await this.db.auth.signIn('admin', 'JDh!uC7mqremk@MB')
        const details = {
            username: username,
            displayName: 'Ewout Stortenbeker',
            password: pass1,
        }
        console.log('adding new user:')
        const result = await this.db.auth.signUp(details)
        console.log(
            `Signed up and in as ${result.user.username}, got access token ${result.accessToken}`
        )
        console.log('signing out of admin')
        await this.db.auth.signOut()
    }
    @Test()
    async signinP1() {
        await signIn(this.db, pass1)
        expect.toThrowAsync(async () => await signIn(this.db, pass2))
    }
    @Test()
    async changePass() {
        const result = await this.db.auth.changePassword(pass1, pass2)
        console.log(
            `Changed password, new accessToken is: ${result.accessToken}`
        )
    }

    @Test()
    async signout() {
        await this.db.auth.signOut()
        console.log(`Signed out!`)
    }

    @Test()
    async signinP2() {
        await signIn(this.db, pass2)
        expect.toThrowAsync(async () => await signIn(this.db, pass1))
    }

    @Test()
    async addData() {
        let updates = {
            profilePic: 'https://profile.com/pic.jpg',
            website: 'http://website.com',
        }
        const result = await this.db.auth.updateUserSettings(updates)
        console.log(`Updated user settings: `, result.user.settings)
    }
    @Test()
    async deleteAccount() {
        await this.db.auth.deleteAccount()
        console.log(`Account is gone and we're signed out`)
    }
    @AfterAll()
    afterAll() {
        console.log('all tests have completed')
        // probably add more teardown here
    }
}

async function signIn(db: AceBaseClient, password: string) {
    const result = await db.auth.signIn(username, password)
    console.log(
        `Signed in as ${result.user.username}, got access token ${result.accessToken}`
    )
}

// January 2022, Luke Harold Miles, public domain obviously
// Adapted from: https://github1s.com/expressjs/express/blob/master/examples/auth/index.js

import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import type { Session } from 'express-session'
import session from 'express-session'

// TYPES

interface UserSession extends Session {
    msg?: string
    user?: User
}
type MyReq = Request & { session: UserSession }

interface User {
    name: string
    salt: string
    hash: string
}

// CONSTANTS

const topBar = `<div>
    <a href="/">home</a>
    <a href="/restricted">/restricted</a>
    <a href="/login">/login</a>
    <a href="/signup">/signup</a>
    <a href="/logout">/logout</a>
</div>`

const userPassInput = `
    <p> <label>Username:</label>
        <input type="text" name="username"> </p>
    <p> <label>Password:</label>
        <input type="text" name="password"> </p>
`

// dummy database
const usersDb: Record<string, User> = {}

const app = (module.exports = express())

// MIDDLEWARE & ROUTES

app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: 'yqb93847ybf137bfryslalskdjnfamnduhfe',
    })
)

// Session-persisted message middleware
app.use(function (req: MyReq, res, next) {
    const msg = req.session.msg
    delete req.session.msg
    res.locals.msg = `<p>Message: ${msg ?? 'no message'}</p>`
    next()
})

app.get('/', rootRoute)
app.get('/restricted', restrict, restrictedRoute)
app.get('/logout', logoutRoute)
app.get('/login', loginGetRoute)
app.post('/login', loginPostRoute)
app.get('/signup', signupGetRoute)
app.post('/signup', signupPostRoute)

// START APP

if (require.main === module) {
    addUser('user', 'pass')
    app.listen(3000)
    logger.info('Express started on port 3000')
}

// LOGIC

function dohash(password: string, salt: string): Buffer {
    return pbkdf2Sync(password, salt, 310000, 32, 'sha256')
}

function makeSalt(): string {
    return randomBytes(128).toString('base64')
}

function addUser(name: string, pass: string): User {
    const salt = makeSalt()
    const hash = dohash(pass, salt).toString('base64')
    const user: User = { name, salt, hash }
    usersDb[name] = user
    return user
}

function authenticate(
    name: string,
    pass: string
): { user?: User; failMessage?: null } | { failMessage: string; user?: null } {
    const user = usersDb[name]
    if (user == null) return { failMessage: 'username not found' }
    const hashedPassword = dohash(pass, user.salt)
    if (!timingSafeEqual(Buffer.from(user.hash, 'base64'), hashedPassword)) {
        return { failMessage: 'incorrect username or password' }
    }
    return { user }
}

// ROUTE FUNCTIONS

function rootRoute(req: MyReq, res: Response) {
    res.send(`<h1>Home</h1> ${topBar} ${res.locals.msg}`)
}

function restrictedRoute(req: MyReq, res: Response) {
    res.send(
        `<h1>Restricted</h1> ${topBar} ${res.locals.msg} Wahoo! restricted area.`
    )
}

function logoutRoute(req: MyReq, res: Response) {
    // destroy the user's session to log them out -- will be re-created next request
    req.session.destroy(() => {
        res.redirect('/')
    })
}

function loginGetRoute(req: MyReq, res: Response) {
    res.send(makeHtmlForm(res, 'login'))
}

function loginPostRoute(req: MyReq, res: Response) {
    const result = authenticate(req.body.username, req.body.password)
    if (result?.user != null) {
        // success
        // Regenerate session when signing in to prevent fixation
        req.session.regenerate(() => {
            req.session.user = result.user
            req.session.msg = `Authenticated as ${result.user?.name}`
            res.redirect('/restricted')
        })
        return
    }
    // failure
    req.session.msg = `Authentication failed: ${result.failMessage}`
    res.redirect('/')
}

function signupGetRoute(req: MyReq, res: Response) {
    res.send(makeHtmlForm(res, 'signup'))
}

function signupPostRoute(req: MyReq, res: Response) {
    const user = addUser(req.body.username, req.body.password)
    req.session.regenerate(() => {
        req.session.user = user
        req.session.msg = `Added user ${user.name}`
        res.redirect('/restricted')
    })
}

// route function helpers

function restrict(req: MyReq, res: Response, next: NextFunction) {
    if (req.session.user) {
        next()
        return
    }
    req.session.msg = 'Access denied!'
    res.redirect('/login')
}

function makeHtmlForm(res: Response, route: 'signup' | 'login'): string {
    return `<h1>${route}</h1>
        ${topBar}
        ${res.locals.msg}
        <form method="post" action="/${route}">
            ${userPassInput}
            <p> <input type="submit" value="${route}"> </p>
        </form> `
}

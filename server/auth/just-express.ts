// January 2022, Luke Harold Miles, public domain obviously
// Adapted from: https://github1s.com/expressjs/express/blob/master/examples/auth/index.js

import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto'
// import ejs from 'ejs'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import type { Session } from 'express-session'
import session from 'express-session'
import path from 'path'

// TYPES

interface UserSession extends Session {
    error?: unknown
    success?: unknown
    user?: User
}
type MyReq = Request & { session: UserSession }

interface User {
    name: string
    salt: string
    hash: string
}

const app = (module.exports = express())

app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express)

app.set('views', path.join(__dirname, 'views'))

// middleware

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
    const err = req.session.error
    const msg = req.session.success
    delete req.session.error
    delete req.session.success
    res.locals.message = ''
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>'
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>'
    next()
})

// dummy database
const users: Record<string, User> = {}

function dohash(password: string, salt: string): Buffer {
    return pbkdf2Sync(password, salt, 310000, 32, 'sha256')
}

function makeSalt(): string {
    return randomBytes(128).toString('base64')
}

function addUser(name: string, pass: string): void {
    const salt = makeSalt()
    const hash = dohash(pass, salt).toString('base64')
    users[name] = { name, salt, hash }
}

function authenticate(
    name: string,
    pass: string
): { user?: User; failMessage?: null } | { failMessage: string; user?: null } {
    console.log('authenticating ${name}:${pass}') // TODO: remove
    const user = users[name]
    if (user == null) return { failMessage: 'username not found' }
    const hashedPassword = dohash(pass, user.salt)
    if (!timingSafeEqual(Buffer.from(user.hash, 'base64'), hashedPassword)) {
        return { failMessage: 'incorrect username or password' }
    }
    return { user }
}

function restrict(req: MyReq, res: Response, next: NextFunction) {
    if (req.session.user) {
        next()
    } else {
        req.session.error = 'Access denied!'
        res.redirect('/login')
    }
}

function rootRoute(req: MyReq, res: Response) {
    res.redirect('/login')
}

function restrictedRoute(req: MyReq, res: Response) {
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>')
}

function logoutRoute(req: MyReq, res: Response) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/')
    })
}

function loginGetRoute(req: MyReq, res: Response) {
    res.render('login')
}

function loginPostRoute(req: MyReq, res: Response) {
    const result = authenticate(req.body.username, req.body.password)
    if (result?.user != null) {
        // Regenerate session when signing in
        // to prevent fixation
        req.session.regenerate(function () {
            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            if (result?.user == null) {
                throw Error('unreachable')
            }
            req.session.user = result.user
            req.session.success = `Authenticated as ${result.user.name} click to <a href="/logout">logout</a>.  You may now access <a href="/restricted">/restricted</a>.`
            res.redirect('back')
        })
    } else {
        req.session.error = `Authentication failed: ${result.failMessage}`
        res.redirect('/login')
    }
}

app.get('/', rootRoute)
app.get('/restricted', restrict, restrictedRoute)
app.get('/logout', logoutRoute)
app.get('/login', loginGetRoute)
app.post('/login', loginPostRoute)

/* istanbul ignore next */
if (require.main === module) {
    addUser('user', 'pass')
    app.listen(3000)
    console.log('Express started on port 3000')
}

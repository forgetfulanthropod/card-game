// import './database'
import type { Application, RequestHandler } from 'express'
import express from 'express'
import session from 'express-session'
import { getLogger, setGlobalRandomSeed } from 'game'
import type { Logger } from 'winston'

import { attachAPIRoutes } from './attachActions'
import { mountIo } from './IO'

declare global {
    // eslint-disable-next-line no-var
    var logger: Logger
}
global.logger = getLogger()

if (process.env.FIXED_SEED === 'yes') {
    logger.info('NOTE: USING FIXED SEED')
    setGlobalRandomSeed()
}

if (process.env.FORCE_NEW_DB === 'yes') {
    // TODO
}

const port = process.env.PORT ?? 3000

export const buildInfo = {
    port,
    gitBranch: process.env.SERVER_GIT_BRANCH ?? '',
    gitCommit: process.env.SERVER_GIT_COMMIT ?? '',
    buildTime: process.env.SERVER_BUILD_TIME ?? '',
}
logger.info(`the server started with ${JSON.stringify(buildInfo)}`)

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionMiddleware: RequestHandler = session({
    secret: 'random secret',
    saveUninitialized: true,
    resave: true,
})
app.use(sessionMiddleware)

attachAPIRoutes(app)

// eslint-disable-next-line no-console
console.log('DIRNAME:', __dirname)
app.use('/', express.static(__dirname + '/client', { extensions: ['.atlas'] }))

if (process.env.USE_ROUTER !== 'yes') {
    const server = app.listen(port, function () {
        logger.info(`Serving on http://localhost:${port}`)
    })
    mountIo(server, sessionMiddleware, buildInfo, '')
}

export function getApp(): typeof app {
    return app
}

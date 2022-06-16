import type { Server } from 'http'
import type { Application } from 'express'
import express from 'express'
import { getLogger, setGlobalRandomSeed } from 'game'
import type { Logger } from 'winston'

import { api } from './api'
import { mountIo as fullMountIo } from './IO'

/** Required for kaiju-router */
export function mountIo(server: Server, prefix: string): void {
    fullMountIo(server, buildInfo, prefix)
}

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

app.post('/api', api)

// eslint-disable-next-line no-console
console.log('DIRNAME:', __dirname)
app.use('/', express.static(__dirname + '/client', { extensions: ['.atlas'] }))

if (process.env.USE_ROUTER !== 'yes') {
    const server = app.listen(port, function () {
        logger.info(`Serving on http://localhost:${port}`)
    })
    fullMountIo(server, buildInfo, '')
}

/** Required for kaiju-router */
export function getApp(): typeof app {
    return app
}

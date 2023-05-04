import type { Application } from 'express'
import express from 'express'
import { setGlobalRandomSeed } from 'game'
import { config as loadDotEnv } from 'dotenv'
import cors from 'cors'
import { mountSocketServer } from './IO'
import { getServerEnv } from '@/../builds/tsc/shared/code'
import { buildInfo } from './build'

const main = () => {
    loadDotEnv()

    const app: Application = express()
    const port = getServerEnv('PORT')

    // setup express
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // set static server to ovveride maxAge for png files:
    const isStagingServer = getServerEnv('DEV_STATIC_ASSETS') === 'yes'
    if (isStagingServer) {
        app.use(
            '/assets',
            express.static(__dirname + '../../public/assets', {
                extensions: ['.atlas', '.txt'],
                maxAge: '1d',
            })
        )
        app.use(
            '/',
            express.static(__dirname + '../../public/', {
                extensions: ['.atlas', '.txt'],
            })
        )
    }

    // logger setup
    const LOG_LEVEL = getServerEnv('LOG_LEVEL')
    logger.transports.forEach(transport => {
        transport.level = LOG_LEVEL
    })
    logger.info(`LOG LEVEL: ${LOG_LEVEL}`)

    // set global seed
    if (getServerEnv('FIXED_SEED') === 'true') {
        logger.info('NOTE: USING FIXED SEED')
        setGlobalRandomSeed('seedThree')
    }

    const server = app.listen(port, function () {
        logger.info(`Serving on http://localhost:${port}`)
    })

    // everything handled from socketio
    mountSocketServer(server, '')

    logger.info(`the server started with ${JSON.stringify(buildInfo)}`)
}

main()

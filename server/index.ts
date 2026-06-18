import type { Application } from 'express'
import express from 'express'
import { setGlobalRandomSeed } from 'game'
import cors from 'cors'
import { mountSocketServer } from './IO'
import { buildInfo } from './build'

// No .env, no dotenv. All config hardcoded for simplicity (json storage, no external db server)
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3456
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
const FIXED_SEED = process.env.FIXED_SEED === 'true'
const DEV_STATIC_ASSETS = true // always serve for easy local run

const main = () => {
    const app: Application = express()
    const port = PORT

    // setup express
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // serve static (dev)
    if (DEV_STATIC_ASSETS) {
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
                setHeaders: (res, filePath) => {
                    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
                        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
                        res.setHeader('Pragma', 'no-cache')
                        res.setHeader('Expires', '0')
                    }
                },
            })
        )
    }

    // logger setup
    logger.transports.forEach(transport => {
        transport.level = LOG_LEVEL
    })
    logger.info(`LOG LEVEL: ${LOG_LEVEL}`)

    // set global seed
    if (FIXED_SEED) {
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

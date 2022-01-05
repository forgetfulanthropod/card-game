import './config/logger'
import './config/overrides'

import { AceBaseServer } from 'acebase-server'

if (require.main === module) {
    void main()
}

async function main() {
    logger.info(`five:  ${five()}`)
    logger.info({ thisis: { json: 'data' } })
    logger.info('starting server...')
    await startDb()
    logger.info('done with that')
}

export function five(): 5 {
    return 5
}

async function startDb() {
    const dbname = 'mydb'
    const server = new AceBaseServer(dbname, { host: 'localhost', port: 5757 })
    await new Promise(resolve => server.ready(() => resolve(null)))
    logger.info('database is ready')
}

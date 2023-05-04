import { Logger } from 'winston'
import { getLogger, setGlobalRandomSeed } from 'game'

declare global {
    // eslint-disable-next-line no-var
    var logger: Logger
}
global.logger = getLogger()

export {}

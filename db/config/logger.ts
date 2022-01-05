import type { Logform, Logger } from 'winston'
import { createLogger, format, transports } from 'winston'

declare global {
    var logger: Logger // eslint-disable-line no-var
}

global.logger = createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
            (info: Logform.TransformableInfo) =>
                `${info.timestamp} [${info.level}] : ${JSON.stringify(
                    info.message
                )}`
        )
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'db.log' }),
    ],
})

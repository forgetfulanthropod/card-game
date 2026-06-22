import { spawnSync } from 'child_process'
import type { Logger } from 'winston'
import winston from 'winston'

export const gitBranch =
    spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
        encoding: 'utf8',
        cwd: __dirname,
    })?.output?.[1]?.trim() ?? 'unknown'

declare global {
    // eslint-disable-next-line no-var
    var logger: Logger
}
const transports = [new winston.transports.Console()];

if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    transports.push(new winston.transports.File({ filename: __dirname + '/../server.log' }));
}

global.logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            (info: winston.Logform.TransformableInfo) =>
                `${info.timestamp} [${info.level}] [${gitBranch}]: ${
                    typeof info.message === 'string'
                        ? info.message
                        : JSON.stringify(info.message)
                }`
        )
    ),
    transports,
})
export function getLogger() {
    return logger
}

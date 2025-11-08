import winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'

const logDirectory = path.join(process.cwd(), 'logs')

const transport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    dirname: logDirectory,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '5d',
    level: 'error',
})

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            info =>
                `[${info.timestamp}] ${info.level.toUpperCase()}: ${
                    info.message
                }`
        )
    ),
    transports: [transport],
})

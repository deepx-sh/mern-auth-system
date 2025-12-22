import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const consoleFormat = winston.format.printf(({ level, message, timestamp, stack, service }) => {
    return `${timestamp} [${service}] ${level}: ${stack || message}`
})
// Log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
);

// Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'SecureNation' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                // winston.format.simple()
                consoleFormat
            )
        }),

        // Rotating files
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level:'error'
        }),

        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        })
    ]
});

export const morganStream = {
    write:(message)=>logger.http(message.trim())
};

export default logger
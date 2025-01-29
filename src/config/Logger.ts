import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = process.env.LOG_DIR || 'logs';
const transports = [];

if (process.env.LOG_TO_CONSOLE === 'true') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({timestamp, level, message}) => {
                    return `${timestamp} ${level}: ${message}`;
                })
            )
        })
    );
}

if (process.env.LOG_TO_FILE === 'true') {
    transports.push(
        new DailyRotateFile({
            filename: `${logDir}/%DATE%-results.log`,
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    );
}

console.log = (...args) => {
    logger.info(...args);
};

console.error = (...args) => {
    logger.error(...args);
};

console.warn = (...args) => {
    logger.warn(...args);
};

console.info = (...args) => {
    logger.info(...args);
};

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports
});

export default logger;

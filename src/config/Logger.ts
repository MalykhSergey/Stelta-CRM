import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = process.env.LOG_DIR || 'logs';
const transports = [];

if (process.env.LOG_TO_CONSOLE === 'true') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({format: 'DD.MM.YYYY HH:mm:ss'}),
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
            filename: `${logDir}/%DATE%.log`,
            datePattern: 'DD.MM.YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp({format: 'DD.MM.YYYY HH:mm:ss'}),
                winston.format.json()
            )
        })
    );
}
if (process.env.MEMORY_LOGGER === 'true') {
    setInterval(() => {
        console.log(`rss: ${process.memoryUsage().rss / (1024 * 1024)}`)
        console.log(`external: ${process.memoryUsage().external / (1024 * 1024)}`)
    }, 1500)
}
console.log = (...args) => {
    logger.info(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(' '));
};

console.error = (...args) => {
    logger.error(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(' '));
};

console.warn = (...args) => {
    logger.warn(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(' '));
};

console.info = (...args) => {
    logger.info(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(' '));
};

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports
});

export default logger;

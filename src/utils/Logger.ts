import { createLogger, transports as Transports, format, addColors } from 'winston';

const { printf, combine, timestamp, colorize, errors } = format;
const colorizer = colorize();

const colors = {
    info: 'white'
};

export const Logger = createLogger({
    transports: new Transports.Console(),
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ message, level, timestamp, stack }) => {
            colorizer.addColors(colors);
            return colorizer.colorize(level, `[${timestamp}] [${level.toUpperCase()}]\t${message}${stack ? "\n" + stack : ""}`);
        })
    )
});

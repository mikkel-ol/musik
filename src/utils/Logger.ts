import { createLogger, transports as Transports, format, addColors } from 'winston';

const { printf, combine, timestamp, colorize } = format;
const colorizer = colorize();

const colors = {
    info: 'white'
};

export const Logger = createLogger({
    transports: new Transports.Console(),
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ message, level, timestamp }) => {
            colorizer.addColors(colors);
            return colorizer.colorize(level, `[${timestamp}] [${level.toUpperCase()}]\t${message}`);
        })
    )
});

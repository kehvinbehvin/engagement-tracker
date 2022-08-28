const {format, transports, createLogger} = require('winston');
const { combine, json, timestamp, errors, prettyPrint, colorize } = format;
require("dotenv").config();

const logger = createLogger({
    level: 'debug',
    format: combine(json(), timestamp(), errors({stack: true}), prettyPrint(), colorize()),
    defaultMeta: { service: 'core' },
    transports: [
        new transports.Console()
    ],
});


export default logger
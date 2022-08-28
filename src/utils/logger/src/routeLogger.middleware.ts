import logger from "./logger"
import {Request, Response, NextFunction} from "express";
require("dotenv").config();

const routeLogChannel = logger.child({
    channel: 'routes' ,
})

async function routeLogger(req: Request, res: Response, next: NextFunction) {
    const path = req.originalUrl;
    const hostname = req.hostname;
    const method = req.method;
    const content_type = req.header("Content-Type");
    const user_agent = req.header("user-agent");
    routeLogChannel.log("info",`${method} ${path}, Host: ${hostname}, Content-Type: ${content_type}, User-Agent: ${user_agent}`);
    next();
}



export default routeLogger;
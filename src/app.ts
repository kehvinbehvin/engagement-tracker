// Dependencies
import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata"
import logger from "./utils/logger/src/logger";

// Database Connection
import { AppDataSource } from "./data-source";

// Routes
import userRoutes from "./user/user.routes"

// Middleware
import errorHandler from "./utils/error_handling/errorHandler.middleware"
import routeLogger from "./utils/logger/src/routeLogger.middleware";
var cors = require('cors')


const app: Express = express();
const port = process.env.PORT;
const nginxHost = process.env.NGINX_HOST;

var corsOptions = {
    origin: nginxHost,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors());
app.use(express.json());
app.use(routeLogger);
app.use(errorHandler);

userRoutes(app)

AppDataSource.initialize().then(async () => {
    logger.log("info","Database connected")
}).catch(error => console.log(error))


app.listen(port, () => {
    logger.log("info",`Server is running on port ${port}`);
    logger.log("info",`Server listening to nginx at ${nginxHost}`)
});
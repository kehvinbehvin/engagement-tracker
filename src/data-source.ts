import "reflect-metadata"
import { DataSource } from "typeorm"
require("dotenv").config();

const {DB_HOST_POSTGRES, DB_PORT_POSTGRES, DB_DATABASE_POSTGRES, DB_USERNAME_POSTGRES, DB_PASSWORD_POSTGRES, DATABASE_URL, NODE_ENV } = process.env

function getDataSource() {
    if (NODE_ENV === "development") {
        return new DataSource({
            type: "postgres",
            host: DB_HOST_POSTGRES,
            port: Number(DB_PORT_POSTGRES),
            username: DB_USERNAME_POSTGRES,
            password: DB_PASSWORD_POSTGRES,
            database: DB_DATABASE_POSTGRES,
            synchronize: true,
            logging: true,
            entities: [],
            migrations: [],
            subscribers: [],
        })
    } else {
        return new DataSource({
            type: "postgres",
            url: DATABASE_URL,
            synchronize: true,
            logging: true,
            entities: [],
            migrations: [],
            subscribers: [],
            ssl: false,
        })
    }
}

const AppDataSource = getDataSource()

export { AppDataSource }

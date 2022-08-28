import express, {Request, Response} from 'express';
import { AppDataSource } from "./data-source";

require("dotenv").config();

const app = express();

const { PORT } = process.env

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello World!')
  })

AppDataSource.initialize().then(async () => {
    console.log("info","Database connected")
}).catch(error => console.log(error))

app.listen(PORT, () => {
    console.log("info",`Application listening at port ${PORT}`)
})


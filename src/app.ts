import express, {Request, Response} from 'express';

require("dotenv").config();

const app = express();

const { PORT } = process.env

app.get('/', (req: Request, res: Response) => {
    return res.send('Hello World!')
  })

app.listen(PORT, () => {
    console.log("info",`Application listening at port ${PORT}`)
})


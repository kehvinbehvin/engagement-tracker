import express from "express"
require("dotenv").config();

const app = express();

const { PORT } = process.env

app.listen(PORT, () => {
    console.log("info",`Application listening at port ${PORT}`)
})
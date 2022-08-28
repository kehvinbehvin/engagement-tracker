const jwt = require("jsonwebtoken");
require("dotenv").config();
import {Request, Response, NextFunction} from "express";

async function verify(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    if (token.split(' ')[0] !== 'Bearer') {
        return res.status(403).send("Wrong authentication method");
    }

    const tokenValue = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenValue, process.env.TOKEN_KEY);
        res.locals.currentUserId = decoded.user_id
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

export { verify }
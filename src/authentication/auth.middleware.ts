const jwt = require("jsonwebtoken");
require("dotenv").config();
import {Request, Response, NextFunction} from "express";
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError";
import { HTTPAccessDeniedError, } from "../utils/error_handling/src/HTTPAccessDeniedError";

async function verify(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        return next(new HTTPAccessDeniedError("You are not authenticated"));
    }

    if (token.split(' ')[0] !== 'Bearer') {
        return next(new HTTPBadRequestError("Wrong authentication method"));
    }

    const tokenValue = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenValue, process.env.TOKEN_KEY);
        res.locals.currentUserId = decoded.user_id
    } catch (err) {
        return next(new HTTPAccessDeniedError("Invalid Token"));
    }
    return next();
}

export { verify }
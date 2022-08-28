import {Request, Response, NextFunction} from "express";
import {BaseError} from "./src/BaseError";
import {HTTPInternalSeverError} from "./src/HTTPInternalSeverError";

function errorHandler (error: BaseError, req: Request, res: Response, next: NextFunction) {
    if (!error.customError) {
        error = new HTTPInternalSeverError();
    }

    const response = {
        "Error message": `${error.message}`,
    }

    return res.json(response).status(error.statusCode);
}

export default errorHandler;
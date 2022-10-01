import { Request, Response, NextFunction } from 'express';
import newcomerLogger from "./newcomer.logger"
import { completeKeys, isWhiteListed } from "../utils/utils"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes"
import { getNewcomerByEmailTask, createNewcomerTask, getNewcomerByIdTask, removeNewcomerTask, updateNewcomerTask } from "./newcomer.manager"
import pick from "lodash.pick"

export async function getNewcomer(req: Request, res: Response, next: NextFunction) {
    try {
        const newcomerId = Number(req.params.id);
        const newcomer = await getNewcomerByIdTask(newcomerId);

        newcomerLogger.log("info",`Retrieved newcomer id: ${newcomerId}`);
        
        const publicFields = ["firstName", "lastName", "email", "status"]
        const publicNewcomerData = pick(newcomer, publicFields);

        return res.json(publicNewcomerData);
    } catch (error: any) {
        newcomerLogger.log("error", error);
        return next(error);
    }
}

export async function deleteNewcomer(req: Request, res: Response, next: NextFunction) {
    try {
        const newcomerId = Number(req.params.id);
        
        const removedNewcomer = await removeNewcomerTask(newcomerId);

        newcomerLogger.log("info",`Removed newcomer id: ${removedNewcomer.id}`)
    
        const response = {
            "Message": "Newcomer removed",
            "Newcomer id": `${removedNewcomer.id}`,
        }
    
        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        newcomerLogger.log("error", error);
        return next(error);
    }
}

export async function patchNewcomer(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const newcomerId = Number(req.params.id);

        const keyFields = ["firstName", "lastName", "email", "status"];

        const invalidKeys = isWhiteListed(keyFields,data);
    
        if (invalidKeys.length > 0) {
            return res.status(httpStatusCodes.BAD_REQUEST).json({
                "Invalid keys": invalidKeys
            })
        }
    
        const newcomer = await getNewcomerByIdTask(newcomerId);
        const updatedNewcomer = await updateNewcomerTask(newcomer, data);

        newcomerLogger.log("info",`Updated newcomer id: ${updatedNewcomer.id}`)

        const response = {
            "Message": "Newcomer updated",
            "Newcomer id": `${updatedNewcomer.id}`,
        }
    
        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        newcomerLogger.log("error", error);
        return next(error);
    }
}

export async function createNewcomer(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["firstName", "lastName", "email", "status"];
        
        newcomerLogger.log("debug", {
            "message": req.body
        })

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        const existingNewcomer = await getNewcomerByEmailTask(data.email);
       
        if (existingNewcomer !== null) {
            return next(new HTTPBadRequestError("Newcomer already in system"));
        }

        const newcomer = await createNewcomerTask(data);

        newcomerLogger.log("info",`${data.email} created`);

        const response = {
            "Message": "Newcomer added",
            "Newcomer id": `${newcomer.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        newcomerLogger.log("error", error);
        return next(error);
    }
}
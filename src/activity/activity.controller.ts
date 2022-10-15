import { Request, Response, NextFunction } from 'express';
import activityLogger from "./activity.logger"
import { completeKeys, isWhiteListed } from "../utils/utils"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes"
import { createNewActivityTask, getActivityByIdTask, patchActivityByIdTask, removeActivityTask } from "./activity.manager"
import pick from "lodash.pick"

export async function getActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const activityId = Number(req.params.id);
        const newcomer = await getActivityByIdTask(activityId);

        activityLogger.log("info",`Retrieved newcomer id: ${activityId}`);
        
        const publicFields = ["id", "activityDate", "type", "newcomer","admins"]
        const publicNewcomerData = pick(newcomer, publicFields);

        return res.json(publicNewcomerData);
    } catch (error: any) {
        activityLogger.log("error", error);
        return next(error);
    }
}

export async function deleteActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const activityId = Number(req.params.id);
        
        const removedActivity = await removeActivityTask(activityId);

        activityLogger.log("info",`Removed activity id: ${removedActivity.id}`)
    
        const response = {
            "Message": "Activity removed",
            "Newcomer id": `${removedActivity.id}`,
        }
    
        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        activityLogger.log("error", error);
        return next(error);
    }
}

export async function patchActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        const activityId = Number(req.params.id);
        const keyFields = ["activityDate", "type", "newcomerId", "adminIds"];

        activityLogger.log("debug", {
            "message": req.body
        })

        if (!isWhiteListed(keyFields,data)) {
            return next(new HTTPBadRequestError("Invalid keys"));
        }
        
        const updatedActivity = await patchActivityByIdTask(activityId, data)

        const response = {
            "Message": "Activity updated",
            "Activity id": `${updatedActivity.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error: any) {
        activityLogger.log("error", error);
        return next(error);
    }
}

export async function createActivity(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["activityDate", "type", "newcomerId", "adminIds"];
        
        activityLogger.log("debug", {
            "message": req.body
        })

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        const newActivity = await createNewActivityTask(data);

        activityLogger.log("info",`Activity ${newActivity.id} created`);

        const response = {
            "Message": "Activity added",
            "Activity id": `${newActivity.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        activityLogger.log("error", error);
        return next(error);
    }
}

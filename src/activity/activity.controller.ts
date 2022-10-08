import { Request, Response, NextFunction } from 'express';
import activityLogger from "./activity.logger"
import { completeKeys, isWhiteListed } from "../utils/utils"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes"
import { createNewActivityTask } from "./activity.manager"

export async function getActivity() {

}

export async function deleteActivity() {
    
}

export async function patchActivity() {
    
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

        activityLogger.log("info",`${data.email} created`);

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

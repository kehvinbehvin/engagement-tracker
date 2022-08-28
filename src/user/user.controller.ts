import userLogger from "./user.logger"
import { Request, Response, NextFunction } from 'express';
import { getUserById, createUser, removeUser, updateUser, getUserByEmail, login } from "./user.manager"
import { completeKeys, isWhiteListed } from "../utils/utils"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes"
import pick from "lodash.pick"

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = Number(res.locals.currentUserId);
        const user = await getUserById(userId);

        userLogger.log("info",`Retrieved user id: ${userId}`);
        
        const publicFields = ["firstName", "lastName", "email"]
        const publicUserData = pick(user, publicFields);

        return res.json(publicUserData);
    } catch (error: any) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["firstName", "lastName", "email", "password"];
        
        userLogger.log("debug", {
            "message": req.body
        })

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        const existingUser = await getUserByEmail(data.email);
       
        if (existingUser !== null) {
            return next(new HTTPBadRequestError("Email taken"));
        }

        const user = await createUser(data);

        userLogger.log("info",`${user.email} created`);

        const response = {
            "Message": "User added",
            "User id": `${user.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = Number(res.locals.currentUserId);
        
        const removedUser = await removeUser(userId);

        userLogger.log("info",`Removed user id: ${removedUser.id}`)
    
        const response = {
            "Message": "User removed",
            "User id": `${removedUser.id}`,
        }
    
        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function patchUser(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["firstName", "lastName", "email"];

        const invalidKeys = isWhiteListed(keyFields,data);
    
        if (invalidKeys.length > 0) {
            return res.status(httpStatusCodes.BAD_REQUEST).json({
                "Invalid keys": invalidKeys
            })
        }
    
        const userId = Number(res.locals.currentUserId);
        const user = await getUserById(userId);
        const updatedUser = await updateUser(user, data);

        userLogger.log("info",`Updated user id: ${updatedUser.id}`)

        const response = {
            "Message": "User updated",
            "User id": `${updatedUser.id}`,
        }
    
        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function profilelogin(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["email", "password"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        const user = await getUserByEmail(data.email);

        if (!user) {
            return next(new HTTPNotFoundError(`User ${data.email} does not exist`));
        }

        const token = await login(user, data.password);

        if (!token) {
            return next(new HTTPAccessDeniedError("Wrong password or email"));
        }

        userLogger.log("info",`${user.email} logged in`);

        const response = {
            "Access token": token,
        }

        return res.json(response).status(httpStatusCodes.OK);
    } catch (error: any) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function healthCheck(req: Request, res: Response, next: NextFunction) {
    const response = {
        "status": "healthy",
    }

    userLogger.log("info",`Health checked`);

    return res.json(response).status(httpStatusCodes.OK);
}
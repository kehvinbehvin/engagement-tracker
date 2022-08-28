import {NextFunction, Request, Response} from "express";
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes";
import {HTTPBadRequestError} from "../utils/error_handling/src/HTTPBadRequestError";
import { completeKeys } from "../utils/utils"
import userLogger from "./user.logger";

import { getUserById, createUser, updateUser, removeUser, getUserByEmail, login } from "./user.manager"
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError";


export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        if (!res.locals.currentUser) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }

        const userId = Number(req.params.id);
        const user = await getUserById(userId);

        userLogger.log("info",`Retrieved user id: ${userId}`);

        return res.json(user);

    } catch (error: any) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;

        const keyFields = ["firstName", "lastName","email","password"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        // TODO Add check for existing users with same email
        const user = await createUser(data);

        userLogger.log("info",`${user.email} created`);

        const response = {
            "Message": "User added",
            "User id": `${user.id}`,
        }

        return res.json(response).status(httpStatusCodes.OK);

    } catch (error) {
        userLogger.log("error", error);
        return next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = Number(req.params.id);

        if (!res.locals.currentUser) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
        
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

        const keyFields = ["id", "firstName", "lastName","email","password"];
    
        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        if (!res.locals.currentUser) {
            return next(new HTTPAccessDeniedError("You need to be authenticated"));
        }
    
        const userId = Number(data.id);
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

        const keyFields = ["email","password"];

        if (!completeKeys(keyFields,data)) {
            return next(new HTTPBadRequestError("Incomplete data"));
        }

        const user = await getUserByEmail(data.email);

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


import { Request, Response, NextFunction } from 'express';
import activityLogger from "./activity.logger"
import { completeKeys, isWhiteListed } from "../utils/utils"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import { HTTPAccessDeniedError } from "../utils/error_handling/src/HTTPAccessDeniedError"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import httpStatusCodes from "../utils/error_handling/configs/httpStatusCodes"

export async function getActivity() {

}

export async function deleteActivity() {
    
}

export async function patchActivity() {
    
}

export async function createActivity() {
    
}

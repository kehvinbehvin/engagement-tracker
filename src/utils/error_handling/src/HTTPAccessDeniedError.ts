import httpStatusCodes from '../configs/httpStatusCodes';
import { BaseError } from './BaseError';

export class HTTPAccessDeniedError extends BaseError {
    constructor (
        message: string = 'Access denied',
        statusCode: number = httpStatusCodes.ACCESS_DENIED,
        isOperational: boolean = true
    ) {
        super("Access denied", statusCode, isOperational, message)
    }
}


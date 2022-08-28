import httpStatusCodes from '../configs/httpStatusCodes';
import { BaseError } from './BaseError';

export class HTTPBadRequestError extends BaseError {
    constructor (
        message: string = 'Bad Request',
        statusCode: number = httpStatusCodes.BAD_REQUEST,
        isOperational: boolean = true
    ) {
        super("Bad Request", statusCode, isOperational, message)
    }
}

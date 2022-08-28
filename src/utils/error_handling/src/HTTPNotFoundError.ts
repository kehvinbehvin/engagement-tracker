import httpStatusCodes from '../configs/httpStatusCodes';
import { BaseError } from './BaseError';

export class HTTPNotFoundError extends BaseError {
    constructor (
        message: string = 'Not Found',
        statusCode: number = httpStatusCodes.NOT_FOUND,
        isOperational: boolean = true
    ) {
        super("Not Found", statusCode, isOperational, message)
    }
}

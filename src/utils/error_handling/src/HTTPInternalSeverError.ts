import httpStatusCodes from '../configs/httpStatusCodes';
import { BaseError } from './BaseError';

export class HTTPInternalSeverError extends BaseError {
    constructor (
        message: string = 'Internal server error',
        statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR,
        isOperational: boolean = true
    ) {
        super("Internal server error", statusCode, isOperational, message)
    }
}

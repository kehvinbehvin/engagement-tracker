export class BaseError extends Error {

    public customError: boolean;
    public statusCode: number;
    public isOperational: boolean;
    public name: string;
    public message: string;

    constructor (name: string, statusCode: number, isOperational: boolean, message: string) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.customError = true;
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.message = message
        Error.captureStackTrace(this)
    }
}

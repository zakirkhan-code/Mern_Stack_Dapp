import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config'; // Adjust path as necessary

const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "development" ? err.stack : "",
    });
};

export default globalErrorHandler;

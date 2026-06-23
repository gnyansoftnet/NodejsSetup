import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${err.message}`
    );

 
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            type: err.statusCode === 400 ? 'WARNING' : 'ERROR',
            message: err.message,
        });
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            type: 'ERROR',
            message: 'Duplicate entry found',
        });
    }

    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            success: false,
            type: 'ERROR',
            message: 'Database connection refused',
        });
    }
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({
            success: false,
            type: 'ERROR',
            message: 'Database connection lost',
        });
    }


    if (err.code === 'ER_CON_COUNT_ERROR') {
        return res.status(503).json({
            success: false,
            type: 'ERROR',
            message: 'Database has too many connections',
        });
    }

    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        return res.status(503).json({
            success: false,
            type: 'ERROR',
            message: 'Database access denied',
        });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            type: 'ERROR',
            message: 'Invalid JSON in request body',
        });
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        type: 'ERROR',
        message: err.message || 'Internal Server Error',
    });
};
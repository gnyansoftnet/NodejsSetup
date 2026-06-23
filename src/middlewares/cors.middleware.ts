import cors from 'cors';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { corsOptions, IS_PROD } from '../config/cors.config';

export const corsMiddleware: RequestHandler = cors(corsOptions);
export const handlePreflight: RequestHandler = cors(corsOptions);

export function corsErrorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err.message?.startsWith('CORS policy')) {
        res.status(403).json({
            status: 'error',
            code: 'CORS_ORIGIN_BLOCKED',
            message: IS_PROD
                ? 'Cross-origin request blocked.'
                : err.message, // expose detail only in dev
        });
        return;
    }
    next(err);
}


export function openCors(): RequestHandler {
    return cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: false,
    });
}

export function strictCors(allowedOrigin: string): RequestHandler {
    return cors({
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
}
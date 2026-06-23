import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ALLOWED_ORIGINS } from '../config/cors.config';


export const corsLogger: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const origin = req.headers.origin;

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
        console.warn(
            `[CORS] Blocked request from origin: ${origin} | ` +
            `${req.method} ${req.path} | ` +
            `${new Date().toISOString()}`
        );
    }

    next();
};
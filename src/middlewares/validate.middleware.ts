// src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../utils/app-error";

export const validateDto = (DtoClass: new () => object) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(DtoClass, req.body);
        const errors = await validate(dtoInstance, {
            whitelist: true,
            forbidNonWhitelisted: true
        });

        if (errors.length > 0) {
            const messages = errors.map(err =>
                Object.values(err.constraints ?? {}).join(", ")
            );
            return next(new AppError(400, messages.join("; ")));
        }

        req.body = dtoInstance;
        next();
    };
};
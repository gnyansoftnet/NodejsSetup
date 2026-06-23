// src/utils/response.util.ts
import { Response } from "express";

export const sendSuccess = (
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
): Response => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const sendCreated = (
    res: Response,
    data: any,
    message: string = "Created successfully"
): Response => {
    return res.status(201).json({
        success: true,
        message,
        data
    });
};

export const sendPaginated = (
    res: Response,
    data: any[],
    total: number,
    page: number,
    limit: number
): Response => {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 400
): Response => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};
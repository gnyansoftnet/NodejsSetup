// src/utils/validators.ts
import { AppError } from "./app-error";

export const requireString = (value: any, fieldName: string, maxLength?: number): string => {
    if (!value || typeof value !== "string" || value.trim() === "") {
        throw new AppError(400, `${fieldName} is required`);
    }
    if (maxLength && value.length > maxLength) {
        throw new AppError(400, `${fieldName} cannot exceed ${maxLength} characters`);
    }
    return value.trim();
};

export const requirePositiveInt = (value: any, fieldName: string): number => {
    const num = Number(value);
    if (value === undefined || value === null || !Number.isInteger(num) || num <= 0) {
        throw new AppError(400, `${fieldName} must be a valid positive number`);
    }
    return num;
};
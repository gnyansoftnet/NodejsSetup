import { inject, injectable, singleton } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async.handler";
import { sendSuccess } from "../utils/response.util";
import { requirePositiveInt, requireString } from "../utils/validators";
import { IUserPermissionService } from "../services/interfaces/user-permission-service.interface";
import { UserPermissionUpdateDto } from "../dtos/user-permission-update.dto";
import { TOKENS } from "../di/tokens";

@singleton()
@injectable()
export class UserPermissionController {
    constructor(
        @inject(TOKENS.UserPermissionService)
        private userPermissionService: IUserPermissionService,
    ) { }

    getUserPermissionsByuserId = asyncHandler(async (req: Request, res: Response) => {
        const userId = requirePositiveInt(req.query.userId, "userId is required and must be a positive integer");
        const rolePermissions = await this.userPermissionService.getUserPermissionsByuserId(userId);
        return sendSuccess(res, rolePermissions);
    });

    updateUserPermissions = asyncHandler(async (req: Request, res: Response) => {
        const userId = requirePositiveInt(req.query.userId, "userId is required and must be a positive integer");
        const modifiedBy = requireString(req.query.modifiedBy, "Modified By is required");
        const permissions: UserPermissionUpdateDto[] = req.body;
        const rolePermissions = await this.userPermissionService.updateUserPermissions(userId, permissions, modifiedBy);
        return sendSuccess(res, rolePermissions, "User permissions updated successfully");
    });






}
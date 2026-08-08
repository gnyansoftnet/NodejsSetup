import { inject, injectable, singleton } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async.handler";
import { IModuleService } from "../services/interfaces/module-service.interface";
import { sendSuccess } from "../utils/response.util";
import { IRolePermissionService } from "../services/interfaces/role-permission-service.interface";
import { requirePositiveInt, requireString } from "../utils/validators";
import { RolePermissionUpdateDto } from "../dtos/role-prmission-update.dto";
import { TOKENS } from "../di/tokens";

@singleton()
@injectable()
export class RolePermissionController {
    constructor(
        @inject(TOKENS.RolePermissionService)
        private readonly rolePermissionService: IRolePermissionService,
    ) { }

    getRolePermissionsByroleId = asyncHandler(async (req: Request, res: Response) => {
        const roleId = requirePositiveInt(req.query.roleId, "Role ID is required and must be a positive integer");
        const rolePermissions = await this.rolePermissionService.getRolePermissionsByroleId(roleId);
        return sendSuccess(res, rolePermissions);
    });

    updateRolePermissions = asyncHandler(async (req: Request, res: Response) => {
        const roleId = requirePositiveInt(req.query.roleId, "Role ID is required and must be a positive integer");
        const modifiedBy = requireString(req.query.modifiedBy, "Modified By is required");
        const permissions: RolePermissionUpdateDto[] = req.body;
        const rolePermissions = await this.rolePermissionService.updateRolePermissions(roleId, permissions, modifiedBy);
        return sendSuccess(res, rolePermissions, "Role permissions updated successfully");
    });






}
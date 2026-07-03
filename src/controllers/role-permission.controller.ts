import { inject, injectable, singleton } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async.handler";
import { IModuleService } from "../services/module.service";
import { sendSuccess } from "../utils/response.util";
import { IRolePermissionService } from "../services/role-permission.service";
import { requirePositiveInt, requireString } from "../utils/validators";
import { RolePermissionUpdateDto } from "../dtos/role-prmission-update.dto";

@singleton()
@injectable()
export class RolePermissionController {
    constructor(
        @inject("IRolePermissionService")
        private rolePermissionService: IRolePermissionService,
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